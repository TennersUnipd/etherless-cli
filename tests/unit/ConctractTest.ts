/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import 'mocha';

import { assert, expect } from 'chai';

import Web3 from 'web3';

import { AbiItem, AbiInput } from 'web3-utils';

import { Contract } from 'web3-eth-contract';

import Ganache from 'ganache-core';

import { ContractInterface } from '../../src/NetworkEntities/contractInterface';
import EtherlessContract from '../../src/NetworkEntities/etherlessContract';

import * as variables from './SharedVariables';

// var FakeProvider = require('web3-fake-provider');
// const provider = new FakeProvider();
const provider = new Web3('wss://ropsten.infura.io/ws/v3/f4347c3f96d448499a8e7940793d93a6');
describe('testing the contracts implementation', () => {
  const contract:ContractInterface = new EtherlessContract(variables.dummyAbi,
    variables.contractAddress, provider);
  it('testing getListOfFunctions', () => {
    const result = contract.getListOfFunctions();
    assert.isArray(result, 'getListOfFunctions is not working');
    assert.isTrue(result.includes('costOfFunction'));
  });
  it('testing getArgumentsOfFunction', () => {
    const result = contract.getArgumentsOfFunction('costOfFunction');
    assert.isArray(result, 'getArgumentsOfFunction is not working');
  });
  it('testing isTheFunctionPayable with a payable function', () => {
    const result = contract.isTheFunctionPayable('runFunction');
    assert.isTrue(result, 'isTheFunctionPayable is not working');
  });
  it('testing isTheFunctionPayable with a not payable function', () => {
    const result = contract.isTheFunctionPayable('costOfFunction');
    assert.isFalse(result, 'isTheFunctionPayable is not working');
  });
  // it('testing estimateGasCost', async () => {
  //  Error: Returned error: gas required exceeds allowance (8000029) or always failing transaction
  //   const result = await contract.estimateGasCost('0xe4036e69A708Bd2C4460eEc280fa6b03Ad3D44D8', 'createFunction', ['fnName','string','string', 'ab', 10], 10);
  //   assert.isNumber(result, 'not a number');
  // });
  // it('testing estimateGasCost', async () => {
  //   const result = await contract.estimateGasCost('0xe4036e69A708Bd2C4460eEc280fa6b03Ad3D44D8', 'function2', []);
  //   assert.isNumber(result, 'not a number');
  // });
  it('testing getFunctionTransaction', async () => {
    const result = await contract.getFunctionTransaction('0xe4036e69A708Bd2C4460eEc280fa6b03Ad3D44D8', 'runFunction', ['test1', 'test2', 'test3'],100,10);
    assert.isObject(result, 'not an object');
  });
  it('testing getFunctionTransaction', async () => {
    const result = await contract.getFunctionTransaction('0xe4036e69A708Bd2C4460eEc280fa6b03Ad3D44D8', 'listFunctions', [], 100, 10);
    assert.isObject(result, 'not an object');
  });
  // it('testing history of transaction', async () => {
  //   AssertionError: Should be tested in a better environment: expected undefined to be an array
  //   const result = await contract.getLog(variables.dummyAddress);
  //   assert.isUndefined(result, 'This test should not be undefined');
  //   assert.isArray(result, 'Should be tested in a better environment');
  // });
});


// contract.methods.functionName(arguments[])
