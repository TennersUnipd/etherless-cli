/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import 'mocha';

import { assert } from 'chai';

import mockito, { instance } from 'ts-mockito';

import Ganache from 'ganache-core';

import Web3 from 'web3';

import { ContractInterface } from '../../src/NetworkEntities/contractInterface';
import EtherlessSession from '../../src/NetworkEntities/etherlessSession';
import SessionInterface from '../../src/NetworkEntities/sessionInterface';

import * as sv from './SharedVariables';

 // Mock of Contract Interface
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
  /*it('testing signup method', () => {
    const result = session.signup('test');
    assert.isTrue(result, 'The signup method doesn\'t work');
  });*/
  it('testing logon method', () => {
    const result = session.logon(' ', ' ');
    assert.isTrue(result, "The logon method doesn't work");
  });
  /*it('testing getBalance method', async () => {
    //1) Testing EtherlessSession class
    //testing getBalance method:
    //getBalance is not working
    //+ expected - actual
    //-false
    //+true
    try {
      await session.getBalance()
        .then((result) => {
          //console.log(result);//stampa 0
          assert.equal(result, 10, 'il risultato aspettato non è valido');
        })
        .catch((err) => Promise.reject(err));
      // give a valid value to test mocking account balance
    } catch (err) {
      assert.isTrue(false, 'getBalance is not working');
    }
  });*/
  it('testing getUserAdress method', () => {
    const address = session.getUserAddress();
    assert.isString(address, 'the return type is wrong');
  });
  it('testing signTransaction method', async () => {
      //1) Testing EtherlessSession class
      //testing signTransaction method:
      //Get Function Transaction is not working
      //+ expected - actual
      //-false
      //+true
    try {
      const contractTranscation = await contract.getFunctionTransaction('0xe4036e69A708Bd2C4460eEc280fa6b03Ad3D44D8', 'runFunction', ['t1','t2','t3'],100,10)
        .then((result) => result)
        .catch((err) => Promise.reject(err));
      const signedTransaction = await session.signTransaction(contractTranscation, 'password')
        .then((result) => result)
        .catch((err) => Promise.reject(err));
    } catch (err) {
      assert.isTrue(false, 'Get Function Transaction is not working');
    }
  });
  it('testing logout method', () => {
    session.logout();
    const result = session.isUserSignedIn();
    assert.isFalse(result, 'The signup method doesn\'t work');
  });
});
