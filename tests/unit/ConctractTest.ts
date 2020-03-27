import 'mocha';
import DOTENV from 'dotenv-flow';
import { assert } from 'chai';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import EtherlessContract from '../../src/NetworkEntities/etherlessContract';
import { ContractInterface } from '../../src/NetworkEntities/contractInterface';
import NetworkUtils from '../../src/NetworkEntities/NetworkUtils';


const envConfig = { node_env: 'development' };
DOTENV.config(envConfig);
const endpoint = 'http://127.0.0.1:7545';

describe('testing the contracts implementation', () => {
  const contract:ContractInterface = new EtherlessContract(NetworkUtils.getAbi(process.env.ABI_PATH),
    process.env.CONTRACT_ADDRESS, endpoint);
  it('testing getListOfFunctions', () => {
    const result = contract.getListOfFunctions();
    result.forEach((element) => {
      console.log(element);
    });
    assert.isArray(result, 'getListOfFunctions is not working');
  });
  it('testing getArgumentsOfFunction', () => {
    const result = contract.getArgumentsOfFunction('createFunction');
    result.forEach((element) => {
      console.log(element);
    });
    assert.isArray(result, 'getArgumentsOfFunction is not working');
  });
  it('testing isTheFunctionPayable', () => {
    const result = contract.isTheFunctionPayable('createFunction');
    assert.equal(result, false, 'isTheFunctionPayable is not working');
  });
  it('testing estimateGasCost', async () => {
    const result = await contract.estimateGasCost('0xe4036e69A708Bd2C4460eEc280fa6b03Ad3D44D8', 'createFunction', 'test');
    assert.isNumber(result, 'not a number');
  });
  it('testing getFunctionTransaction', async () => {
    const result = await contract.getFunctionTransaction('0xe4036e69A708Bd2C4460eEc280fa6b03Ad3D44D8', 'createFunction', ['pippo']);
    assert.isObject(result, 'not an object');
  });
});


// contract.methods.functionName(arguments[])
