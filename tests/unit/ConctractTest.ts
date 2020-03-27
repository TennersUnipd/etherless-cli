import 'mocha';
import DOTENV from 'dotenv-flow';
import { assert } from 'chai';
import Web3 from 'web3';
import EtherlessContract from '../../src/NetworkEntities/etherlessContract';
import { ContractInterface } from '../../src/NetworkEntities/contractInterface';
import NetworkUtils from '../../src/NetworkEntities/NetworkUtils';


const envConfig = { node_env: 'development' };
DOTENV.config(envConfig);
const endpoint = 'http://127.0.0.1:7545';

describe('testing the contracta implementation', () => {
  const contract:ContractInterface = new EtherlessContract(NetworkUtils.getAbi(process.env.ABI_PATH), process.env.CONTRACT_ADDRESS, endpoint);
  it('testing method list function', () => {
    const result = contract.getListOfFunctions();
    result.forEach((element) => {
      console.log(element);
    });
    assert.isArray(result, 'ok');
  });
});
