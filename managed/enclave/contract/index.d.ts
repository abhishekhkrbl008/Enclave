import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  memberSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  memberPath(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, { leaf: Uint8Array,
                                                                           path: { sibling: { field: bigint
                                                                                            },
                                                                                   goes_left: boolean
                                                                                 }[]
                                                                         }];
}

export type ImpureCircuits<PS> = {
  enterRoom(context: __compactRuntime.CircuitContext<PS>, roomIndex_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  closeEnclave(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  enterRoom(context: __compactRuntime.CircuitContext<PS>, roomIndex_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  closeEnclave(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  enterRoom(context: __compactRuntime.CircuitContext<PS>, roomIndex_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  closeEnclave(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly enclaveName: string;
  readonly roomLabels: string[];
  readonly roomCount: bigint;
  roomVisits: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): bigint;
    [Symbol.iterator](): Iterator<[bigint, bigint]>
  };
  usedNullifiers: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  readonly allowlistRoot: Uint8Array;
  readonly isOpen: boolean;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>,
               name_0: string,
               labels_0: string[],
               numRooms_0: bigint,
               root_0: Uint8Array): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
