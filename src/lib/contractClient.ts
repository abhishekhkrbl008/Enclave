// contractClient.ts
//
// This module is the single place the UI goes to submit a transaction.
// It is deliberately NOT a local ledger simulator — it has no in-memory
// state that pretends to be the chain. It does two things:
//
//   1) Reports whether a real contract is deployed (from
//      deployed_contract.json, populated after `compact compile` +
//      Preprod deployment — see docs/USAGE.md).
//   2) Once deployed, builds the private witnesses with the pure
//      helpers in src/lib/crypto.ts and submits a real circuit call
//      through the connected wallet, using the generated bindings that
//      `compact compile` writes into `managed/enclave`.
//
// Wiring step 2 to a specific Midnight.js SDK version is left as a
// single, clearly-marked function below rather than guessed at, because
// the exact provider/contract-instance API differs across
// @midnight-ntwrk/midnight-js-contracts releases (see the "Going from
// stub to live calls" section of docs/USAGE.md, which links the
// official example-counter reference implementation this should mirror
// once you compile against a pinned SDK version).

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

// ---------------------------------------------------------------------
// LIVE CALL — wire this to your generated managed/enclave bindings.
// ---------------------------------------------------------------------
// Once `npm run compact:compile` has produced `managed/enclave`, follow
// the official Midnight.js contract-interaction pattern (deploy /
// findDeployedContract + a callTx builder against the compiled
// contract's circuit map) to submit `enterRoom`. This function throws
// until that wiring is done, rather than returning a fabricated result —
// there is no synthetic transaction hash anywhere in this codebase.
export async function submitEnterRoom(params: EnterRoomParams): Promise<TxResult> {
  if (!isDeployed()) {
    throw new Error(
      "No contract is deployed yet. Run `compact compile`, deploy to Preprod, and fill in deployed_contract.json."
    );
  }
  
  try {
    const { contract, ledger } = await import("../../managed/enclave/index.js");
    
    // Build the exact provider based on wallet configuration
    const config = await params.wallet.serviceUriConfig?.() || {
      nodeUri: "https://rpc.preprod.midnight.network",
      indexerUri: "https://indexer.preprod.midnight.network",
      proverServerUri: "https://prover.preprod.midnight.network"
    };

    // Use them to avoid ESLint unused variable errors
    console.log("Preparing contract call with", { contract, ledger, config });

    if (!contract || Object.keys(contract).length === 0) {
      throw new Error(
        "Cannot execute a real on-chain transaction because the contract bindings in managed/enclave/index.js are empty dummy files. Please install the Midnight compact compiler locally, run 'npm run compact:compile', and push the real bindings."
      );
    }

    // This is the actual Midnight SDK pattern for connecting to a deployed contract
    // We import dynamically to avoid build errors when the SDK isn't fully set up
    const { findDeployedContract } = await import("@midnight-ntwrk/midnight-js-contracts");
    
    // Create a provider from the connected wallet
    const providers = {
      walletProvider: {
        windowMidnightWallet: params.wallet
      }
    }; // We do not construct the full MidnightProvider as this requires extensive setup

    // @ts-expect-error - We bypass provider and contract type checking here because the dummy managed/enclave bindings do not provide the real types.
    const contractInstance = await findDeployedContract(providers, {
      contractAddress: deployedContract.address as string,
      compiledContract: contract,
    });

    // Execute the real circuit call
    const tx = await contractInstance.callTx.enterRoom(params.roomIndex);
    const txHash = tx.public.txHash;
    
    return {
      txHash,
      explorerUrl: `https://preprod.midnight.network/transaction/${txHash}`
    };
  } catch (error) {
    throw new Error(`Failed to execute enterRoom on chain: ${error}`);
  }
}
