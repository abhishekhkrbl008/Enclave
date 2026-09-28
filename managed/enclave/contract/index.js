import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.16.0');

const _descriptor_0 = __compactRuntime.CompactTypeBoolean;

const _descriptor_1 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_2 = __compactRuntime.CompactTypeField;

class _MerkleTreeDigest_0 {
  alignment() {
    return _descriptor_2.alignment();
  }
  fromValue(value_0) {
    return {
      field: _descriptor_2.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.field);
  }
}

const _descriptor_3 = new _MerkleTreeDigest_0();

class _MerkleTreePathEntry_0 {
  alignment() {
    return _descriptor_3.alignment().concat(_descriptor_0.alignment());
  }
  fromValue(value_0) {
    return {
      sibling: _descriptor_3.fromValue(value_0),
      goes_left: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_3.toValue(value_0.sibling).concat(_descriptor_0.toValue(value_0.goes_left));
  }
}

const _descriptor_4 = new _MerkleTreePathEntry_0();

const _descriptor_5 = new __compactRuntime.CompactTypeVector(10, _descriptor_4);

class _MerkleTreePath_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_5.alignment());
  }
  fromValue(value_0) {
    return {
      leaf: _descriptor_1.fromValue(value_0),
      path: _descriptor_5.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.leaf).concat(_descriptor_5.toValue(value_0.path));
  }
}

const _descriptor_6 = new _MerkleTreePath_0();

const _descriptor_7 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

const _descriptor_8 = new __compactRuntime.CompactTypeBytes(6);

class _LeafPreimage_0 {
  alignment() {
    return _descriptor_8.alignment().concat(_descriptor_1.alignment());
  }
  fromValue(value_0) {
    return {
      domain_sep: _descriptor_8.fromValue(value_0),
      data: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_8.toValue(value_0.domain_sep).concat(_descriptor_1.toValue(value_0.data));
  }
}

const _descriptor_9 = new _LeafPreimage_0();

const _descriptor_10 = new __compactRuntime.CompactTypeVector(3, _descriptor_1);

const _descriptor_11 = new __compactRuntime.CompactTypeVector(2, _descriptor_2);

const _descriptor_12 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

class _Either_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_0.fromValue(value_0),
      left: _descriptor_1.fromValue(value_0),
      right: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.is_left).concat(_descriptor_1.toValue(value_0.left).concat(_descriptor_1.toValue(value_0.right)));
  }
}

const _descriptor_13 = new _Either_0();

const _descriptor_14 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

class _ContractAddress_0 {
  alignment() {
    return _descriptor_1.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.bytes);
  }
}

const _descriptor_15 = new _ContractAddress_0();

const _descriptor_16 = __compactRuntime.CompactTypeOpaqueString;

const _descriptor_17 = new __compactRuntime.CompactTypeVector(3, _descriptor_16);

export class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    if (typeof(witnesses_0.memberSecret) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named memberSecret');
    }
    if (typeof(witnesses_0.memberPath) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named memberPath');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      enterRoom: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`enterRoom: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const roomIndex_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('enterRoom',
                                     'argument 1 (as invoked from Typescript)',
                                     'enclave.compact line 69 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(roomIndex_0) === 'bigint' && roomIndex_0 >= 0n && roomIndex_0 <= 255n)) {
          __compactRuntime.typeError('enterRoom',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'enclave.compact line 69 char 1',
                                     'Uint<0..256>',
                                     roomIndex_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_7.toValue(roomIndex_0),
            alignment: _descriptor_7.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._enterRoom_0(context,
                                           partialProofData,
                                           roomIndex_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      closeEnclave: (...args_1) => {
        if (args_1.length !== 1) {
          throw new __compactRuntime.CompactError(`closeEnclave: expected 1 argument (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('closeEnclave',
                                     'argument 1 (as invoked from Typescript)',
                                     'enclave.compact line 98 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: { value: [], alignment: [] },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._closeEnclave_0(context, partialProofData);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      }
    };
    this.impureCircuits = {
      enterRoom: this.circuits.enterRoom,
      closeEnclave: this.circuits.closeEnclave
    };
    this.provableCircuits = {
      enterRoom: this.circuits.enterRoom,
      closeEnclave: this.circuits.closeEnclave
    };
  }
  initialState(...args_0) {
    if (args_0.length !== 5) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 5 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    const name_0 = args_0[1];
    const labels_0 = args_0[2];
    const numRooms_0 = args_0[3];
    const root_0 = args_0[4];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialPrivateState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialPrivateState' in argument 1 (as invoked from Typescript)`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!(Array.isArray(labels_0) && labels_0.length === 3 && labels_0.every((t) => true))) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 2 (argument 3 as invoked from Typescript)',
                                 'enclave.compact line 44 char 1',
                                 'Vector<3, Opaque<"string">>',
                                 labels_0)
    }
    if (!(typeof(numRooms_0) === 'bigint' && numRooms_0 >= 0n && numRooms_0 <= 255n)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 3 (argument 4 as invoked from Typescript)',
                                 'enclave.compact line 44 char 1',
                                 'Uint<0..256>',
                                 numRooms_0)
    }
    if (!(root_0.buffer instanceof ArrayBuffer && root_0.BYTES_PER_ELEMENT === 1 && root_0.length === 32)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 4 (argument 5 as invoked from Typescript)',
                                 'enclave.compact line 44 char 1',
                                 'Bytes<32>',
                                 root_0)
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('enterRoom', new __compactRuntime.ContractOperation());
    state_0.setOperation('closeEnclave', new __compactRuntime.ContractOperation());
    const context = __compactRuntime.createCircuitContext(__compactRuntime.dummyContractAddress(), constructorContext_0.initialZswapLocalState.coinPublicKey, state_0.data, constructorContext_0.initialPrivateState);
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_16.toValue(''),
                                                                                              alignment: _descriptor_16.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(1n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(new Array(3).fill('')),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(2n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(3n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(4n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(5n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(6n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(false),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.assert(numRooms_0 >= 1n && numRooms_0 <= 3n,
                            'enclave needs 1-3 rooms');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_16.toValue(name_0),
                                                                                              alignment: _descriptor_16.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(1n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(labels_0),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(2n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(numRooms_0),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(5n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(root_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(6n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(true),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    this._folder_0(context,
                   partialProofData,
                   ((context, partialProofData, t_0, i_0) =>
                    {
                      let t_1;
                      if (t_1 = i_0, t_1 < numRooms_0) {
                        const tmp_0 = i_0;
                        const tmp_1 = 0n;
                        __compactRuntime.queryLedgerState(context,
                                                          partialProofData,
                                                          [
                                                           { idx: { cached: false,
                                                                    pushPath: true,
                                                                    path: [
                                                                           { tag: 'value',
                                                                             value: { value: _descriptor_7.toValue(3n),
                                                                                      alignment: _descriptor_7.alignment() } }] } },
                                                           { push: { storage: false,
                                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(tmp_0),
                                                                                                                  alignment: _descriptor_7.alignment() }).encode() } },
                                                           { push: { storage: true,
                                                                     value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(tmp_1),
                                                                                                                  alignment: _descriptor_2.alignment() }).encode() } },
                                                           { ins: { cached: false,
                                                                    n: 1 } },
                                                           { ins: { cached: true,
                                                                    n: 1 } }]);
                      }
                      return t_0;
                    }),
                   [],
                   [0n, 1n, 2n]);
    state_0.data = new __compactRuntime.ChargedState(context.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    }
  }
  _merkleTreePathRoot_0(path_0) {
    return { field:
               this._folder_1((...args_0) =>
                                this._merkleTreePathEntryRoot_0(...args_0),
                              this._degradeToTransient_0(this._persistentHash_1({ domain_sep:
                                                                                    new Uint8Array([109, 100, 110, 58, 108, 104]),
                                                                                  data:
                                                                                    path_0.leaf })),
                              path_0.path) };
  }
  _merkleTreePathEntryRoot_0(recursiveDigest_0, entry_0) {
    const left_0 = entry_0.goes_left ? recursiveDigest_0 : entry_0.sibling.field;
    const right_0 = entry_0.goes_left ?
                    entry_0.sibling.field :
                    recursiveDigest_0;
    return this._transientHash_0([left_0, right_0]);
  }
  _transientHash_0(value_0) {
    const result_0 = __compactRuntime.transientHash(_descriptor_11, value_0);
    return result_0;
  }
  _persistentHash_0(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_1, value_0);
    return result_0;
  }
  _persistentHash_1(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_9, value_0);
    return result_0;
  }
  _persistentHash_2(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_10, value_0);
    return result_0;
  }
  _persistentHash_3(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_7, value_0);
    return result_0;
  }
  _degradeToTransient_0(x_0) {
    const result_0 = __compactRuntime.degradeToTransient(x_0);
    return result_0;
  }
  _upgradeFromTransient_0(x_0) {
    const result_0 = __compactRuntime.upgradeFromTransient(x_0);
    return result_0;
  }
  _memberSecret_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.memberSecret(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('memberSecret',
                                 'return value',
                                 'enclave.compact line 35 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_1.toValue(result_0),
      alignment: _descriptor_1.alignment()
    });
    return result_0;
  }
  _memberPath_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.memberPath(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'object' && result_0.leaf.buffer instanceof ArrayBuffer && result_0.leaf.BYTES_PER_ELEMENT === 1 && result_0.leaf.length === 32 && Array.isArray(result_0.path) && result_0.path.length === 10 && result_0.path.every((t) => typeof(t) === 'object' && typeof(t.sibling) === 'object' && typeof(t.sibling.field) === 'bigint' && t.sibling.field >= 0 && t.sibling.field <= __compactRuntime.MAX_FIELD && typeof(t.goes_left) === 'boolean'))) {
      __compactRuntime.typeError('memberPath',
                                 'return value',
                                 'enclave.compact line 36 char 1',
                                 'struct MerkleTreePath<leaf: Bytes<32>, path: Vector<10, struct MerkleTreePathEntry<sibling: struct MerkleTreeDigest<field: Field>, goes_left: Boolean>>>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_6.toValue(result_0),
      alignment: _descriptor_6.alignment()
    });
    return result_0;
  }
  _enterRoom_0(context, partialProofData, roomIndex_0) {
    const publicRoomIndex_0 = roomIndex_0;
    __compactRuntime.assert(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_7.toValue(6n),
                                                                                                                  alignment: _descriptor_7.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value),
                            'enclave is closed');
    __compactRuntime.assert(publicRoomIndex_0
                            <
                            _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_7.toValue(2n),
                                                                                                                  alignment: _descriptor_7.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value),
                            'no such room');
    const secret_0 = this._memberSecret_0(context, partialProofData);
    const path_0 = this._memberPath_0(context, partialProofData);
    const leaf_0 = this._persistentHash_0(secret_0);
    __compactRuntime.assert(this._equal_0(path_0.leaf, leaf_0),
                            'path leaf does not match secret');
    const computedRoot_0 = this._merkleTreePathRoot_0(path_0);
    __compactRuntime.assert(this._equal_1(this._upgradeFromTransient_0(computedRoot_0.field),
                                          _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 0 } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_7.toValue(5n),
                                                                                                                                alignment: _descriptor_7.alignment() } }] } },
                                                                                                     { popeq: { cached: false,
                                                                                                                result: undefined } }]).value)),
                            'not on the allowlist');
    const nullifier_0 = this._persistentHash_2([secret_0,
                                                _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                          partialProofData,
                                                                                                          [
                                                                                                           { dup: { n: 0 } },
                                                                                                           { idx: { cached: false,
                                                                                                                    pushPath: false,
                                                                                                                    path: [
                                                                                                                           { tag: 'value',
                                                                                                                             value: { value: _descriptor_7.toValue(5n),
                                                                                                                                      alignment: _descriptor_7.alignment() } }] } },
                                                                                                           { popeq: { cached: false,
                                                                                                                      result: undefined } }]).value),
                                                this._persistentHash_3(publicRoomIndex_0)]);
    __compactRuntime.assert(!_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_7.toValue(4n),
                                                                                                                   alignment: _descriptor_7.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(nullifier_0),
                                                                                                                                               alignment: _descriptor_1.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'already entered this room');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_7.toValue(4n),
                                                                  alignment: _descriptor_7.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(nullifier_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const current_0 = _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 0 } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_7.toValue(3n),
                                                                                                            alignment: _descriptor_7.alignment() } }] } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_7.toValue(publicRoomIndex_0),
                                                                                                            alignment: _descriptor_7.alignment() } }] } },
                                                                                 { popeq: { cached: false,
                                                                                            result: undefined } }]).value);
    const tmp_0 = __compactRuntime.addField(current_0, 1n);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_7.toValue(3n),
                                                                  alignment: _descriptor_7.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(publicRoomIndex_0),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(tmp_0),
                                                                                              alignment: _descriptor_2.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _closeEnclave_0(context, partialProofData) {
    __compactRuntime.assert(_descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_7.toValue(6n),
                                                                                                                  alignment: _descriptor_7.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value),
                            'already closed');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(6n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(false),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    return [];
  }
  _folder_0(context, partialProofData, f, x, a0) {
    for (let i = 0; i < 3; i++) { x = f(context, partialProofData, x, a0[i]); }
    return x;
  }
  _folder_1(f, x, a0) {
    for (let i = 0; i < 10; i++) { x = f(x, a0[i]); }
    return x;
  }
  _equal_0(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_1(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
}
export function ledger(stateOrChargedState) {
  const state = stateOrChargedState instanceof __compactRuntime.StateValue ? stateOrChargedState : stateOrChargedState.state;
  const chargedState = stateOrChargedState instanceof __compactRuntime.StateValue ? new __compactRuntime.ChargedState(stateOrChargedState) : stateOrChargedState;
  const context = {
    currentQueryContext: new __compactRuntime.QueryContext(chargedState, __compactRuntime.dummyContractAddress()),
    costModel: __compactRuntime.CostModel.initialCostModel()
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    get enclaveName() {
      return _descriptor_16.fromValue(__compactRuntime.queryLedgerState(context,
                                                                        partialProofData,
                                                                        [
                                                                         { dup: { n: 0 } },
                                                                         { idx: { cached: false,
                                                                                  pushPath: false,
                                                                                  path: [
                                                                                         { tag: 'value',
                                                                                           value: { value: _descriptor_7.toValue(0n),
                                                                                                    alignment: _descriptor_7.alignment() } }] } },
                                                                         { popeq: { cached: false,
                                                                                    result: undefined } }]).value);
    },
    get roomLabels() {
      return _descriptor_17.fromValue(__compactRuntime.queryLedgerState(context,
                                                                        partialProofData,
                                                                        [
                                                                         { dup: { n: 0 } },
                                                                         { idx: { cached: false,
                                                                                  pushPath: false,
                                                                                  path: [
                                                                                         { tag: 'value',
                                                                                           value: { value: _descriptor_7.toValue(1n),
                                                                                                    alignment: _descriptor_7.alignment() } }] } },
                                                                         { popeq: { cached: false,
                                                                                    result: undefined } }]).value);
    },
    get roomCount() {
      return _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_7.toValue(2n),
                                                                                                   alignment: _descriptor_7.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    roomVisits: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_7.toValue(3n),
                                                                                                     alignment: _descriptor_7.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_12.toValue(0n),
                                                                                                                                 alignment: _descriptor_12.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_12.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_7.toValue(3n),
                                                                                                      alignment: _descriptor_7.alignment() } }] } },
                                                                           'size',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 255n)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'enclave.compact line 26 char 1',
                                     'Uint<0..256>',
                                     key_0)
        }
        return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_7.toValue(3n),
                                                                                                     alignment: _descriptor_7.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(key_0),
                                                                                                                                 alignment: _descriptor_7.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 255n)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'enclave.compact line 26 char 1',
                                     'Uint<0..256>',
                                     key_0)
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_7.toValue(3n),
                                                                                                     alignment: _descriptor_7.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_7.toValue(key_0),
                                                                                                     alignment: _descriptor_7.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[3];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_7.fromValue(key.value),      _descriptor_2.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    usedNullifiers: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_7.toValue(4n),
                                                                                                     alignment: _descriptor_7.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_12.toValue(0n),
                                                                                                                                 alignment: _descriptor_12.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_12.fromValue(__compactRuntime.queryLedgerState(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 0 } },
                                                                           { idx: { cached: false,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_7.toValue(4n),
                                                                                                      alignment: _descriptor_7.alignment() } }] } },
                                                                           'size',
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const elem_0 = args_0[0];
        if (!(elem_0.buffer instanceof ArrayBuffer && elem_0.BYTES_PER_ELEMENT === 1 && elem_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'enclave.compact line 27 char 1',
                                     'Bytes<32>',
                                     elem_0)
        }
        return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_7.toValue(4n),
                                                                                                     alignment: _descriptor_7.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(elem_0),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[4];
        return self_0.asMap().keys().map((elem) => _descriptor_1.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    get allowlistRoot() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_7.toValue(5n),
                                                                                                   alignment: _descriptor_7.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get isOpen() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_7.toValue(6n),
                                                                                                   alignment: _descriptor_7.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    }
  };
}
const _emptyContext = {
  currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({
  memberSecret: (...args) => undefined, memberPath: (...args) => undefined
});
export const pureCircuits = {};
export const contractReferenceLocations =
  { tag: 'publicLedgerArray', indices: { } };
//# sourceMappingURL=index.js.map
