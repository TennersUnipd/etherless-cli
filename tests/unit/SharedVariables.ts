/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { AbiItem } from 'web3-utils';

export const transactionEmpty = {
  from: '',
  to: '',
  gas: 500 * 1.5,
  data: '',
};


export const dummyAbi: AbiItem[] = [{
  inputs: [], payable: false, stateMutability: 'nonpayable', type: 'constructor',
}, {
  anonymous: false,
  inputs: [{
    indexed: false, internalType: 'string', name: '_name', type: 'string',
  }, {
    indexed: false, internalType: 'string', name: '_parameters', type: 'string',
  }, {
    indexed: false, internalType: 'string', name: '_identifier', type: 'string',
  }],
  name: 'RemoteExec',
  type: 'event',
}, {
  anonymous: false,
  inputs: [{
    indexed: false, internalType: 'string', name: '_response', type: 'string',
  }, {
    indexed: false, internalType: 'string', name: '_identifier', type: 'string',
  }],
  name: 'RemoteResponse',
  type: 'event',
}, {
  constant: false, inputs: [{ internalType: 'string', name: 'fnName', type: 'string' }], name: 'function1', outputs: [], payable: true, stateMutability: 'payable', type: 'function',
}, {
  constant: true, inputs: [], name: 'function2', outputs: [{ internalType: 'string[]', name: 'functionNames', type: 'string[]' }], payable: false, stateMutability: 'view', type: 'function',
}];

export const contractAddress = '0xA3865FBE59d6d20647688040f604eEa680D0df32';

export const dummyAddress = '0xe4036e69A708Bd2C4460eEc280fa6b03Ad3D44D8';
