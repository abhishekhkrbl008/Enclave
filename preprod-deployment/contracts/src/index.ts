import { CompiledContract } from "@midnight-ntwrk/midnight-js-protocol/compact-js";

export * from "./managed/enclave/contract/index.js";
export * from "./witnesses";

import * as EnclaveContractModule from "./managed/enclave/contract/index.js";
import * as Witnesses from "./witnesses";

class ContractWrapper extends EnclaveContractModule.Contract<Witnesses.EnclavePrivateState> {
  constructor() {
    super(Witnesses.witnesses);
  }
}

export const CompiledEnclaveContract = CompiledContract.make(
  "enclave",
  ContractWrapper as unknown as new () => EnclaveContractModule.Contract<Witnesses.EnclavePrivateState>
).pipe(
  CompiledContract.withCompiledFileAssets("./managed/enclave")
);
