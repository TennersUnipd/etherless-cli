import 'mocha';
import DOTENV from 'dotenv-flow';
import { assert, expect } from 'chai';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import Ganache from 'ganache-core';
import EtherlessContract from '../../src/NetworkEntities/etherlessContract';
import { ContractInterface } from '../../src/NetworkEntities/contractInterface';
import NetworkUtils from '../../src/NetworkEntities/NetworkUtils';


const envConfig = { node_env: 'development' };
DOTENV.config(envConfig);

const endpoint = Ganache.provider({ mnemonic: 'face doll lava rail horror bus junior fan coyote anger spoon talent' });
describe('testing the contracts implementation', () => {
  const contract:ContractInterface = new EtherlessContract(NetworkUtils.getAbi(process.env.ABI_PATH),
    process.env.CONTRACT_ADDRESS, endpoint);
  it('testing getListOfFunctions', () => {
    const result = contract.getListOfFunctions();
    assert.isArray(result, 'getListOfFunctions is not working');
  });
  it('testing getArgumentsOfFunction', () => {
    const result = contract.getArgumentsOfFunction('createFunction');
    assert.isArray(result, 'getArgumentsOfFunction is not working');
  });
  it('testing isTheFunctionPayable', () => {
    const result = contract.isTheFunctionPayable('createFunction');
    assert.equal(result, false, 'isTheFunctionPayable is not working');
  });
  it('testing estimateGasCost', async () => {
    const result = await contract.estimateGasCost('0xe4036e69A708Bd2C4460eEc280fa6b03Ad3D44D8', 'createFunction', ['string']);
    assert.isNumber(result, 'not a number');
  });
  it('testing getFunctionTransaction', async () => {
    const result = await contract.getFunctionTransaction('0xe4036e69A708Bd2C4460eEc280fa6b03Ad3D44D8', 'createFunction', ['test']);
    assert.isObject(result, 'not an object');
  });
});


// contract.methods.functionName(arguments[])
