/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import 'mocha';
import { assert } from 'chai';
import mockito, { instance } from 'ts-mockito';
import Ganache from 'ganache-core';
import Web3 from 'web3';
import EtherlessSession from '../../src/NetworkEntities/etherlessSession';
import SessionInterface from '../../src/NetworkEntities/SessionInterface';
import * as sv from './SharedVariables';
import { ContractInterface } from '../../src/NetworkEntities/contractInterface';

/* // Mock of Contract Interface
const mockedcontract:ContractInterface = mockito.mock(ContractInterface);
const contract:ContractInterface = instance(mockedcontract);

 // START BEHAVIOR MOCK
mockito.when(mockedcontract.getFunctionTransaction)
  .thenReturn((address, functionName, parameters) => new Promise((resolve, reject) => {
    resolve({
      to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
      from: '0xe4036e69A708Bd2C4460eEc280fa6b03Ad3D44D8',
      value: '1000000000',
      gas: 10,
    });
    reject(new Error('Contract error'));
  }));
// END MOCKS */

const provider:Web3 = new Web3('wss://ropsten.infura.io/ws/v3/f4347c3f96d448499a8e7940793d93a6');


describe('Testing EtherlessSession class', async () => {
  const session:SessionInterface = new EtherlessSession(provider);
  it('testing signup method', () => {
    const result = session.signup('test');
    assert.isTrue(result, 'The signup method doesn\'t work');
  });
  it('testing logon method', () => {
    const result = session.logon('0xeC4C7dba040Ae315603618984279D23De13C8804', 'Riccardo97');
    assert.isTrue(result, "The logon method doesn't work");
  });
  it('testing getBalance method', async () => {
    try {
      await session.getBalance()
        .then((result) => {
          assert.equal(result, 10, 'il risultato aspettato non è valido');
        })
        .catch((err) => Promise.reject(err));
      // give a valid value to test mocking account balance
    } catch (err) {
      assert.isTrue(false, 'getBalance is not working');
    }
  });
  it('testing logout method', () => {
    session.logout();
    const result = session.isUserSignedIn();
    assert.isTrue(result, 'The signup method doesn\'t work');
  });
  it('testing getUserAdress method', () => {
    const address = session.getUserAddress();
    assert.isString(address, 'the return type is wrong');
  });
  /* it('testing signTransaction method', async () => {
    try {
      const contractTranscation = await contract.getFunctionTransaction('0x31cEd6A92aC0439BB61207D6f52C82B0fe0DC566', 'function1', ciao)
        .then((result) => result)
        .catch((err) => Promise.reject(err));
      const signedTransaction = await session.signTransaction(contractTranscation, 'password')
        .then((result) => result)
        .catch((err) => Promise.reject(err));
    } catch (err) {
      assert.isTrue(false, 'Get Function Transaction is not working');
    }
  }); */
});
