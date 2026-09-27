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
export async function submitEnterRoom(_params: EnterRoomParams): Promise<TxResult> {
  if (!isDeployed()) {
    throw new Error(
      "No contract is deployed yet. Run `compact compile`, deploy to Preprod, and fill in deployed_contract.json."
    );
  }
  throw new Error(
    "Live circuit call not wired yet — see docs/USAGE.md 'Going from stub to live calls' for the exact steps once you've pinned a Midnight.js SDK version."
  );
}
