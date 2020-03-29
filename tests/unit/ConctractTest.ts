import 'mocha';
import { assert, expect } from 'chai';
import Web3 from 'web3';
import { AbiItem, AbiInput } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import Ganache from 'ganache-core';
import EtherlessContract from '../../src/NetworkEntities/etherlessContract';
import { ContractInterface } from '../../src/NetworkEntities/contractInterface';
import * as variables from './SharedVariables';

const provider = Ganache.provider({ mnemonic: 'face doll lava rail horror bus junior fan coyote anger spoon talent' });
describe('testing the contracts implementation', () => {
  const contract:ContractInterface = new EtherlessContract(variables.dummyAbi,
    variables.contractAddress, provider);
  it('testing getListOfFunctions', () => {
    const result = contract.getListOfFunctions();
    assert.isArray(result, 'getListOfFunctions is not working');
    assert.isTrue(result.includes('function1') && result.includes('function2'));
  });
  it('testing getArgumentsOfFunction', () => {
    const result = contract.getArgumentsOfFunction('function1');
    assert.isArray(result, 'getArgumentsOfFunction is not working');
  });
  it('testing isTheFunctionPayable with a payable function', () => {
    const result = contract.isTheFunctionPayable('function1');
    assert.isTrue(result, 'isTheFunctionPayable is not working');
  });
  it('testing isTheFunctionPayable with a not payable function', () => {
    const result = contract.isTheFunctionPayable('function2');
    assert.isFalse(result, 'isTheFunctionPayable is not working');
  });
  it('testing estimateGasCost', async () => {
    const result = await contract.estimateGasCost('0xe4036e69A708Bd2C4460eEc280fa6b03Ad3D44D8', 'function1', ['string']);
    assert.isNumber(result, 'not a number');
  });
  it('testing getFunctionTransaction', async () => {
    const result = await contract.getFunctionTransaction('0xe4036e69A708Bd2C4460eEc280fa6b03Ad3D44D8', 'function1', ['test']);
    assert.isObject(result, 'not an object');
  });
  it('testing history of transaction', async () => {
    const result = await contract.getLog(variables.dummyAddress);
    assert.isUndefined(result, 'This test should not be undefined');
    assert.isArray(result, 'Should be tested in a better environment');
  });
});


// contract.methods.functionName(arguments[])
