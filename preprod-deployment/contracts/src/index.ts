import { CompiledContract } from "@midnight-ntwrk/midnight-js-protocol/compact-js";

export * from "./managed/enclave/contract/index.js";
export * from "./witnesses";

import * as CompiledEnclaveContract from "./managed/enclave/contract/index.js";
import * as Witnesses from "./witnesses";

class ContractWrapper extends CompiledEnclaveContract.Contract<Witnesses.EnclavePrivateState> {
  constructor() {
    super(Witnesses.witnesses);
  }
}

export const CompiledEnclaveContractContract = CompiledContract.make(
  "enclave",
  ContractWrapper as unknown as new () => CompiledEnclaveContract.Contract<Witnesses.EnclavePrivateState>
).pipe(
  CompiledContract.withCompiledFileAssets("./managed/enclave")
);
