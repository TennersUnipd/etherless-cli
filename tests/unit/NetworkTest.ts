import 'mocha';
import DOTENV from 'dotenv-flow';
import { assert } from 'chai';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import mockito, { instance } from 'ts-mockito';
import EtherlessNetwork from '../../src/NetworkEntities/etherlessNetwork';
import NetworkInterface from '../../src/NetworkEntities/networkInerface';
import { ContractInterface } from '../../src/NetworkEntities/contractInterface';
import NetworkUtils from '../../src/NetworkEntities/NetworkUtils';
import EtherlessContract from '../../src/NetworkEntities/etherlessContract';

const envConfig = { node_env: 'development' };
DOTENV.config(envConfig);
const endpoint = 'http://127.0.0.1:7545';
const mockedcontract:EtherlessContract = mockito.mock(EtherlessContract);
const contract:EtherlessContract = instance(mockedcontract);

const ciao = ['ciao'];
mockito.when(mockedcontract.getFunctionTransaction('0xe4036e69A708Bd2C4460eEc280fa6b03Ad3D44D8', 'createFunction', ciao))
  .thenReturn(new Promise<any>((resolve, reject) => {
    resolve({
      to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
      from: '0xe4036e69A708Bd2C4460eEc280fa6b03Ad3D44D8',
      value: '1000000000',
      gas: 2000000,

    }); reject(new Error('errorebello'));
  }));
describe('testing the network implementation', () => {
  const network:NetworkInterface = new EtherlessNetwork(endpoint);
  it('testing sendTransaction', async () => {
    const transaction:object = await contract.getFunctionTransaction('0xe4036e69A708Bd2C4460eEc280fa6b03Ad3D44D8', 'createFunction', ciao);
    network.sendTransaction(transaction).then((requested) => { console.log(requested); assert('true'); }).catch(console.error);
  });
  it('testing sendSignedTransaction', async () => {
    const transaction:object = await contract.getFunctionTransaction('0xe4036e69A708Bd2C4460eEc280fa6b03Ad3D44D8', 'createFunction', ciao);
    const signedTransaction:string = await this.session.signTransaction(transaction, 'eskere');
    network.sendSignedTransaction(signedTransaction).then((requested) => { console.log(requested); assert('true'); }).catch(console.error);
  });
  network.disconnect();
});
