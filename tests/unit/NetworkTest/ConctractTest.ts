/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import 'mocha';

import { assert, expect } from 'chai';

import Web3 from 'web3';


import { ContractInterface, Transaction, FunctionRequest } from '../../../src/NetworkEntities/contractInterface';
import EtherlessContract from '../../../src/NetworkEntities/etherlessContract';

import * as variables from './SharedVariables';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const FakeProvider = require('web3-fake-provider');

const provider = new FakeProvider();
const web3 = new Web3(provider);
describe('testing the contracts implementation', () => {
  const contract: ContractInterface = new EtherlessContract(variables.dummyAbi,
    variables.contractAddress, web3);
  it('testing isTheFunctionPayable with a payable function', () => {
    const result = contract.isTheFunctionPayable('runFunction');
    assert.isTrue(result, 'isTheFunctionPayable is not working');
  });
  it('testing isTheFunctionPayable with a not payable function', () => {
    const result = contract.isTheFunctionPayable('costOfFunction');
    assert.isFalse(result, 'isTheFunctionPayable is not working');
  });
  it('testing getFunctionTransaction', async () => {
    const rqF: FunctionRequest = {
      functionName: 'runFunction',
      userAddress: '0xe4036e69A708Bd2C4460eEc280fa6b03Ad3D44D8',
      args: ['test1', 'test2', 'test3'],
      value: 10,
    };
    const result: Transaction = await contract.getFunctionTransaction(rqF);
    assert.isOk(result.from === '0xe4036e69A708Bd2C4460eEc280fa6b03Ad3D44D8');
  });
});


// contract.methods.functionName(arguments[])
