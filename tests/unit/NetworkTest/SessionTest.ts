
import 'mocha';

import { assert, expect } from 'chai';

import Web3 from 'web3';

import EtherlessSession from '../../../src/NetworkEntities/etherlessSession';
import SessionInterface from '../../../src/NetworkEntities/sessionInterface';

import * as sv from './SharedVariables';

const FakeProvider = require('web3-fake-provider');

const provider = new FakeProvider();

const web3: Web3 = new Web3(provider);

const dummyToReturn = web3.utils.toHex(100);

const DummyTransaction = {
  to: '',
  from: '0xa0cfd291c29ed4c1666d173e97744b99ce42ddfb',
  value: web3.utils.toHex(1000000000),
  gas: web3.utils.toHex(53000000),
};
// END MOCKS


describe('Testing EtherlessSession class', () => {
  const session: SessionInterface = new EtherlessSession(web3);
  it('testing signup method', () => {
    const result = session.signup('test');
    assert.isTrue(result, 'The signup method doesn\'t work');
  });

  it('testing logout method', () => {
    session.logout();
    const result = session.isUserSignedIn();
    assert.isFalse(result, 'The logout method doesn\'t work');
  });
  
  it('testing logon method', () => {
    const result = session.logon('0x8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f', 'password');
    assert.isTrue(result, "The logon method doesn't work");
  });

  it('testing getBalance method', () => {
    provider.injectResult(dummyToReturn);
    session.getBalance().then((result) => {
      assert.equal(result, 100, 'should return the correct amount');
    }).catch((err) => { console.log(err); });
  });

  it('testing getUserAddress method', () => {
    const address = session.getUserAddress();
    assert.isString(address, 'the return type is wrong');
  });

  it('testing signTransaction method', () => {
    provider.injectResult(100);
    provider.injectResult(100);
    provider.injectResult(100);
    session.signTransaction(DummyTransaction, 'password').then((result) => {
      assert.isObject(result, 'Is not valid object');
      expect(result).to.have.property('rawTransaction');
    }).catch(console.log);
  });

});
