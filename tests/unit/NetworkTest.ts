import 'mocha';
import { assert } from 'chai';
import mockito, { instance } from 'ts-mockito';
import Ganache from 'ganache-core';
import EtherlessNetwork from '../../src/NetworkEntities/etherlessNetwork';
import NetworkInterface from '../../src/NetworkEntities/networkInerface';
import { ContractInterface } from '../../src/NetworkEntities/contractInterface';
import SessionInterface from '../../src/NetworkEntities/SessionInterface';

const endpoint = Ganache.provider;
const mockedcontract:ContractInterface = mockito.mock(ContractInterface);
const contract:ContractInterface = instance(mockedcontract);
const mockedSession:SessionInterface = mockito.mock(SessionInterface);
const session:SessionInterface = instance(mockedSession);

const ciao = ['ciao'];
mockito.when(mockedcontract.getFunctionTransaction)
  .thenReturn((address, functionName, parameters) => new Promise((resolve, reject) => {
    resolve({
      to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
      from: '0xe4036e69A708Bd2C4460eEc280fa6b03Ad3D44D8',
      value: '1000000000',
      gas: 2000000,
    });
    reject(new Error('Contract error'));
  }));

mockito.when(mockedSession.signTransaction)
  .thenReturn((transaction, password) => new Promise((resolve, reject) => {
    resolve({
      messageHash: '0x31c2f03766b36f0346a850e78d4f7db2d9f4d7d54d5f272a750ba44271e370b1',
      v: '0x25',
      r: '0xc9cf86333bcb065d140032ecaab5d9281bde80f21b9687b3e94161de42d51895',
      s: '0x727a108a0b8d101465414033c3f705a9c7b826e596766046ee1183dbc8aeaa68',
      rawTransaction: '0xf869808504e3b29200831e848094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca008025a0c9cf86333bcb065d140032ecaab5d9281bde80f21b9687b3e94161de42d51895a0727a108a0b8d101465414033c3f705a9c7b826e596766046ee1183dbc8aeaa68',
      transactionHash: '0xde8db924885b0803d2edc335f745b2b8750c8848744905684c20b987443a9593',
    });
    reject(new Error('Signature error'));
  }));
describe('testing the network implementation', () => {
  const network:NetworkInterface = new EtherlessNetwork(endpoint);
  it('testing sendTransaction', async () => {
    const transaction:object = await contract.getFunctionTransaction('0xe4036e69A708Bd2C4460eEc280fa6b03Ad3D44D8', 'createFunction', ciao);
    network.sendTransaction(transaction, 'eskere').then((requested) => { console.log(requested); assert('true'); }).catch(console.error);
  });
  it('testing sendSignedTransaction', async () => {
    const transaction:object = await contract.getFunctionTransaction('0xe4036e69A708Bd2C4460eEc280fa6b03Ad3D44D8', 'createFunction', ciao);
    const signedTransaction:string = await session.signTransaction(transaction, 'eskere');
    network.sendSignedTransaction(signedTransaction, 'eskere').then((requested) => { console.log(requested); assert('true'); }).catch(console.error);
  });
  network.disconnect();
});
