/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { AbiItem } from 'web3-utils';
import Web3 from 'web3';

export const transactionEmpty = {
  from: 0x5f9fa656d0c8a61b70cd0715962dc6dbcffa356e,
  to: 0xbc8aa05e7b58f6fb53d197ee0028f987a4181ab9,
  gas: Web3.utils.toHex(400),
  data: 0xab7eb5e800000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000a746573744a617475733200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000474657374000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004746574730000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000047465737400000000000000000000000000000000000000000000000000000000,
  value: 10,
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
  constant: true, inputs: [{ internalType: 'string', name: 'fnName', type: 'string' }], name: 'costOfFunction', outputs: [{ internalType: 'uint256', name: 'cost', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function',
}, {
  constant: false, inputs: [{ internalType: 'string', name: 'fnName', type: 'string' }, { internalType: 'string', name: 'description', type: 'string' }, { internalType: 'string', name: 'prototype', type: 'string' }, { internalType: 'string', name: 'remoteResource', type: 'string' }, { internalType: 'uint256', name: 'cost', type: 'uint256' }], name: 'createFunction', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function',
}, {
  constant: true,
  inputs: [{ internalType: 'string', name: 'fnToSearch', type: 'string' }],
  name: 'findFunctions',
  outputs: [{
    components: [{ internalType: 'string', name: 'name', type: 'string' }, { internalType: 'string', name: 'description', type: 'string' }, { internalType: 'string', name: 'prototype', type: 'string' }, { internalType: 'uint256', name: 'cost', type: 'uint256' }, { internalType: 'address payable', name: 'owner', type: 'address' }, { internalType: 'string', name: 'remoteResource', type: 'string' }], internalType: 'struct Utils.Function', name: '', type: 'tuple',
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function',
}, {
  constant: true, inputs: [], name: 'getBalance', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function',
}, {
  constant: true, inputs: [], name: 'listFunctions', outputs: [{ internalType: 'string[]', name: 'functionNames', type: 'string[]' }], payable: false, stateMutability: 'view', type: 'function',
}, {
  constant: false, inputs: [{ internalType: 'string', name: 'fnName', type: 'string' }, { internalType: 'string', name: 'paramers', type: 'string' }, { internalType: 'string', name: 'identifier', type: 'string' }], name: 'runFunction', outputs: [], payable: true, stateMutability: 'payable', type: 'function',
}, {
  constant: false, inputs: [{ internalType: 'string', name: 'result', type: 'string' }, { internalType: 'string', name: 'identifier', type: 'string' }], name: 'sendResponse', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function',
}];


export const contractAddress = '0xA3865FBE59d6d20647688040f604eEa680D0df32';

export const dummyAddress = '0xe4036e69A708Bd2C4460eEc280fa6b03Ad3D44D8';
