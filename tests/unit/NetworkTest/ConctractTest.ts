/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import 'mocha';

import { assert, expect } from 'chai';

import Web3 from 'web3';

import { AbiItem, AbiInput } from 'web3-utils';

import { Contract } from 'web3-eth-contract';

import Ganache from 'ganache-core';

import { ContractInterface } from '../../../src/NetworkEntities/contractInterface';
import EtherlessContract from '../../../src/NetworkEntities/etherlessContract';

import * as variables from './SharedVariables';

const FakeProvider = require('web3-fake-provider');

const provider = new FakeProvider();
const web3 = new Web3(provider);
describe('testing the contracts implementation', () => {
  const contract: ContractInterface = new EtherlessContract(variables.dummyAbi,
    variables.contractAddress, web3);
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
  it('testing estimateGasCost', async () => {
    provider.injectResult(web3.utils.toHex(50));
    contract.estimateGasCost(
      '0xe4036e69A708Bd2C4460eEc280fa6b03Ad3D44D8',
      'createFunction', ['fnName', 'string', 'string', 'ab', 10],
      10,
    )
      .then((result) => { assert.equal(result, 50, 'GasCost is returning the wrong number'); })
      .catch(assert.fail);
  });
  it('testing getFunctionTransaction', async () => {
    const result = await contract.getFunctionTransaction('0xe4036e69A708Bd2C4460eEc280fa6b03Ad3D44D8', 'runFunction', ['test1', 'test2', 'test3'], 100, 10);
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
