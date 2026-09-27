import { Ledger } from "./managed/enclave/contract/index.js";
import { WitnessContext } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";

/*
 * The private state needed by the enclave contract:
 * - memberSecret: the member's secret (Bytes<32>)
 * - memberPath: the Merkle path proving membership in the allowlist
 */

export type EnclavePrivateState = {
  readonly memberSecret: Uint8Array;
  readonly memberPath: {
    leaf: Uint8Array;
    path: Array<{ sibling: { field: bigint }; goes_left: boolean }>;
  };
};

export const createEnclavePrivateState = (
  memberSecret: Uint8Array,
  memberPath: EnclavePrivateState["memberPath"]
): EnclavePrivateState => ({
  memberSecret,
  memberPath,
});

export const witnesses = {
  memberSecret: ({
    privateState,
  }: WitnessContext<Ledger, EnclavePrivateState>): [
    EnclavePrivateState,
    Uint8Array,
  ] => [privateState, privateState.memberSecret],

  memberPath: ({
    privateState,
  }: WitnessContext<Ledger, EnclavePrivateState>): [
    EnclavePrivateState,
    EnclavePrivateState["memberPath"],
  ] => [privateState, privateState.memberPath],
};
