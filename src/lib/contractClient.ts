// contractClient.ts
//
// Submits a real on-chain enterRoom transaction via the Midnight Preprod network.
// Uses the official Midnight DApp Connector API pattern:
//   - wallet.balanceUnsealedTransaction() + wallet.submitTransaction()
//   - Real compiled circuit bindings from managed/enclave/contract/index.js
//   - FetchZkConfigProvider for prover keys served from /public/
//   - httpClientProofProvider for server-side proof generation

import deployedContract from "../../deployed_contract.json";
import { WalletApi } from "./midnightWallet";

export interface DeploymentInfo {
  network: string;
  address: string | null;
}

export function getDeployment(): DeploymentInfo {
  return { network: deployedContract.network, address: deployedContract.address };
}

export function isDeployed(): boolean {
  return Boolean(deployedContract.address);
}

export interface EnterRoomParams {
  wallet: WalletApi;
  memberSecret: string;
  roomIndex: number;
}

export interface TxResult {
  txHash: string;
  explorerUrl: string;
}

export async function submitEnterRoom(params: EnterRoomParams): Promise<TxResult> {
  if (!isDeployed()) {
    throw new Error(
      "No contract is deployed yet. Fill in deployed_contract.json with a valid Preprod contract address."
    );
  }

  try {
    // Step 1: Load real compiled bindings
    const EnclaveBindings = await import("../../managed/enclave/contract/index.js");
    console.debug("[contractClient] Bindings loaded. Exports:", Object.keys(EnclaveBindings));

    // Step 2: Get service URIs from the connected wallet
    let serviceUris: { nodeUri: string; indexerUri: string; indexerWsUri?: string; proverServerUri: string };
    if (typeof params.wallet.getConfiguration === "function") {
      serviceUris = await params.wallet.getConfiguration!();
    } else if (typeof params.wallet.serviceUriConfig === "function") {
      serviceUris = await params.wallet.serviceUriConfig!();
    } else {
      serviceUris = {
        nodeUri: "https://rpc.preprod.midnight.network",
        indexerUri: "https://indexer.preprod.midnight.network/api/v1/graphql",
        indexerWsUri: "wss://indexer.preprod.midnight.network/api/v1/graphql/ws",
        proverServerUri: "https://prover.preprod.midnight.network",
      };
    }
    console.debug("[contractClient] Service URIs:", serviceUris);

    // Step 3: Get shielded addresses from wallet (needed for walletProvider)
    let coinPublicKey = "";
    let encryptionPublicKey = "";
    if (typeof params.wallet.getShieldedAddresses === "function") {
      const addrs = await params.wallet.getShieldedAddresses!();
      coinPublicKey = addrs.shieldedCoinPublicKey;
      encryptionPublicKey = addrs.shieldedEncryptionPublicKey;
      console.debug("[contractClient] Shielded addresses obtained");
    } else {
      const state = await params.wallet.state();
      coinPublicKey = state.coinPublicKey ?? state.address;
      encryptionPublicKey = state.encryptionPublicKey ?? state.address;
      console.debug("[contractClient] Fallback: using address as keys");
    }

    // Step 4: Import SDK providers
    const { FetchZkConfigProvider } = await import("@midnight-ntwrk/midnight-js-fetch-zk-config-provider");
    const { httpClientProofProvider } = await import("@midnight-ntwrk/midnight-js-http-client-proof-provider");
    const { indexerPublicDataProvider } = await import("@midnight-ntwrk/midnight-js-indexer-public-data-provider");
    const { findDeployedContract } = await import("@midnight-ntwrk/midnight-js-contracts");
    const { fromHex, toHex } = await import("@midnight-ntwrk/compact-runtime");
    console.debug("[contractClient] Midnight SDK providers loaded");

    // Step 5: Build ZK config provider (serves prover keys from /public/ folder)
    const zkConfigProvider = new FetchZkConfigProvider(window.location.origin, fetch.bind(window));

    // Step 6: Construct the full providers object matching the official DApp pattern
    const providers = {
      privateStateProvider: (() => {
        const store = new Map<string, Uint8Array>();
        return {
          setContractAddress: () => {},
          get: (k: string) => Promise.resolve(store.get(k) ?? null),
          set: (k: string, v: Uint8Array) => { store.set(k, v); return Promise.resolve(); },
          remove: (k: string) => { store.delete(k); return Promise.resolve(); },
          clear: () => { store.clear(); return Promise.resolve(); },
          setSigningKey: () => Promise.resolve(),
          getSigningKey: () => Promise.resolve(null),
          removeSigningKey: () => Promise.resolve(),
          clearSigningKeys: () => Promise.resolve(),
          exportPrivateStates: () => Promise.resolve({ format: "midnight-private-state-export", encryptedPayload: "", salt: "" }),
          importPrivateStates: () => Promise.resolve({ imported: 0, skipped: 0, overwritten: 0 }),
          exportSigningKeys: () => Promise.resolve({ format: "midnight-signing-key-export", encryptedPayload: "", salt: "" }),
          importSigningKeys: () => Promise.resolve({ imported: 0, skipped: 0, overwritten: 0 }),
        };
      })(),
      zkConfigProvider,
      proofProvider: httpClientProofProvider(serviceUris.proverServerUri, zkConfigProvider),
      publicDataProvider: indexerPublicDataProvider(
        serviceUris.indexerUri,
        serviceUris.indexerWsUri ?? serviceUris.indexerUri.replace("https", "wss").replace("http", "ws"),
        window.WebSocket, // Use browser-native WebSocket instead of isomorphic-ws which fails in browser
      ),
      walletProvider: {
        getCoinPublicKey: () => coinPublicKey,
        getEncryptionPublicKey: () => encryptionPublicKey,
        balanceTx: async (tx: unknown) => {
          console.debug("[contractClient] Balancing tx via wallet...");
          // @ts-expect-error - tx is UnboundTransaction from SDK
          const serialized = toHex(tx.serialize());
          const result = await params.wallet.balanceUnsealedTransaction!(serialized);
          const { Transaction } = await import("@midnight-ntwrk/midnight-js-protocol/ledger");
          return Transaction.deserialize("signature", "proof", "binding", fromHex(result.tx));
        },
      },
      midnightProvider: {
        submitTx: async (tx: unknown) => {
          console.debug("[contractClient] Submitting tx to blockchain via wallet...");
          // @ts-expect-error - tx is FinalizedTransaction from SDK
          const txHex = toHex(tx.serialize());
          const result = await params.wallet.submitTransaction!(txHex);
          // @ts-expect-error - tx.identifiers() from SDK
          const ids = tx.identifiers?.();
          const txId = ids?.[0] ?? result?.txHash ?? txHex.slice(0, 64);
          console.debug("[contractClient] Transaction submitted, txId:", txId);
          return txId;
        },
      },
    };

    // Step 7: Derive private state from the member secret
    const memberSecretBytes = new Uint8Array(32);
    const encoded = new TextEncoder().encode(params.memberSecret);
    memberSecretBytes.set(encoded.slice(0, 32));

    // Step 8: Instantiate the compiled contract with witnesses
    const contractInstance = new EnclaveBindings.Contract({
      memberSecret: ({ privateState }: { privateState: { memberSecret: Uint8Array; memberPath: { leaf: Uint8Array; path: { sibling: { field: bigint }; goes_left: boolean }[] } } }) =>
        [privateState, privateState.memberSecret] as [typeof privateState, Uint8Array],
      memberPath: ({ privateState }: { privateState: { memberSecret: Uint8Array; memberPath: { leaf: Uint8Array; path: { sibling: { field: bigint }; goes_left: boolean }[] } } }) =>
        [privateState, privateState.memberPath] as [typeof privateState, typeof privateState.memberPath],
    });
    console.debug("[contractClient] Contract instance ready:", contractInstance);

    // Step 9: Connect to the already-deployed contract on Preprod
    // findDeployedContract requires compiledContract (a wrapped CompiledContract object).
    // Since we don't have CompiledContract.make() available, we use @ts-expect-error to
    // pass the raw Contract instance and let the SDK resolve it at runtime.
    // @ts-expect-error - Provider/contract type complexity; raw Contract instance passed as compiledContract
    const deployedInstance = await findDeployedContract(providers, {
      contractAddress: deployedContract.address,
      compiledContract: contractInstance,
      privateStateId: "enclave",
      initialPrivateState: {
        memberSecret: memberSecretBytes,
        memberPath: { leaf: memberSecretBytes, path: [] },
      },
    });
    console.debug("[contractClient] Connected to deployed contract at", deployedContract.address);

    // Step 10: Submit the real on-chain transaction
    console.debug("[contractClient] Calling enterRoom circuit...");
    const tx = await deployedInstance.callTx.enterRoom(BigInt(params.roomIndex));
    console.debug("[contractClient] Transaction result:", tx);

    // Extract txHash from multiple possible shapes
    const txHash: string =
      (tx as { public?: { txHash?: string } })?.public?.txHash ??
      (tx as { txHash?: string })?.txHash ??
      String(tx);

    console.debug("[contractClient] txHash:", txHash);

    return {
      txHash,
      explorerUrl: `https://preprod.midnight.network/transaction/${txHash}`,
    };
  } catch (error) {
    console.error("[contractClient] Error during enterRoom:", error);
    throw new Error(`Failed to execute enterRoom on chain: ${error}`);
  }
}
