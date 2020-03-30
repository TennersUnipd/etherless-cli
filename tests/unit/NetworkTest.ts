/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import 'mocha';
import { assert } from 'chai';
import mockito, { instance } from 'ts-mockito';
import Ganache from 'ganache-core';
import EtherlessNetwork from '../../src/NetworkEntities/etherlessNetwork';
import NetworkInterface from '../../src/NetworkEntities/networkInerface';
import { ContractInterface } from '../../src/NetworkEntities/contractInterface';
import SessionInterface from '../../src/NetworkEntities/SessionInterface';
import 'ethereumjs-tx';

// Mock of Contract Interface
const mockedcontract:ContractInterface = mockito.mock(ContractInterface);
const contract:ContractInterface = instance(mockedcontract);

// Mock of Session Interface
const mockedSession:SessionInterface = mockito.mock(SessionInterface);
const session:SessionInterface = instance(mockedSession);

const ciao = ['ciao'];

// START BEHAVIOR MOCK
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
    resolve('0xf869808504e3b29200831e848094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca008025a0c9cf86333bcb065d140032ecaab5d9281bde80f21b9687b3e94161de42d51895a0727a108a0b8d101465414033c3f705a9c7b826e596766046ee1183dbc8aeaa68');
    reject(new Error('Signature error'));
  }));

// END MOCKS

const provider = Ganache.provider({ mnemonic: 'face doll lava rail horror bus junior fan coyote anger spoon talent', accounts: [{ balance: 42000001000000000, address: '0xe4036e69A708Bd2C4460eEc280fa6b03Ad3D44D8' }] });

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});
describe('testing the network implementation', () => {
  const network:NetworkInterface = new EtherlessNetwork(provider);
  it('testing sendTransaction', async () => {
    try {
      const contractTranscation = await contract.getFunctionTransaction('0x31cEd6A92aC0439BB61207D6f52C82B0fe0DC566', 'function1', ciao);
      const signedTransaction = await session.signTransaction(contractTranscation, 'password');
      network.sendSignedTransaction(signedTransaction);
      assert.isTrue(true, 'always true');
    } catch (err) {
      assert.isTrue(false, 'always false');
    }
  });
  it('testing sendSignedTransaction', async () => {
    try {
      const contractTranscation = await contract.getFunctionTransaction('0x31cEd6A92aC0439BB61207D6f52C82B0fe0DC566', 'function1', ciao)
        .then((result) => result)
        .catch((err) => Promise.reject(err));
      const signedTransaction = await session.signTransaction(contractTranscation, 'password')
        .then((result) => result)
        .catch((err) => Promise.reject(err));
      network.sendSignedTransaction(signedTransaction)
        .then((result) => result)
        .catch((err) => Promise.reject(err));
      assert.isTrue(true, 'always true');
    } catch (err) {
      assert.isTrue(false, 'Get Function Transaction is not working');
    }
  });
  network.disconnect();
});
