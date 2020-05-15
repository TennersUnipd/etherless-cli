/* eslint-disable @typescript-eslint/unbound-method */
import 'mocha';

import { assert } from 'chai';

import mockito from 'ts-mockito';

import Utils from '../../../src/utils';

import { ContractInterface, Transaction, FunctionRequest } from '../../../src/NetworkEntities/contractInterface';

import { NetworkFacade } from '../../../src/NetworkEntities/networkFacade';

import NetworkInterface from '../../../src/NetworkEntities/networkInterface';

import SessionInterface from '../../../src/NetworkEntities/sessionInterface';

// Creating mock
const mockedNetwork: NetworkInterface = mockito.mock(NetworkInterface);
const mockedSession: SessionInterface = mockito.mock(SessionInterface);
const mockedContract: ContractInterface = mockito.mock(ContractInterface);
const mockedUtils: Utils = mockito.mock(Utils);

const tPassword = 'passwordTest';
const tUserKey = 'validPrivateKey';
const tUserAddress = 'realUserAddress';
const tWrongPassword = '';
const trs: Transaction = {
  from: 'realAddress',
  to: 'realAddress',
  gas: 10,
  data: 'trueData',
  value: 10,
};

const fr: FunctionRequest = {
  userAddress: 'realAddres',
  functionName: 'function',
  args: ['arg1'],
  value: 0,
};

const listOfPayable = ['createFunction', 'runFunction', 'deleteFunction'];

mockito.when(mockedContract.isTheFunctionPayable)
  .thenReturn((req) => listOfPayable.includes(req));

mockito.when(mockedSession.getUserAddress).thenReturn(() => 'Indirizzo verissimo');

mockito.when(mockedSession.logout).thenReturn(() => { assert.call(mockedSession.logout, 'called another method'); });

mockito.when(mockedContract.getFunctionTransaction);

mockito.when(mockedNetwork.sendTransaction);

describe('testing networkFacade', () => {
  const networkFacade: NetworkFacade = new NetworkFacade(
    mockito.instance(mockedNetwork),
    mockito.instance(mockedSession),
    mockito.instance(mockedContract),
  );
  // TESTING SIGNUP
  it('testing signup function', () => {
    // stub method before execution
    mockito.when(mockedSession.signup)
      .thenReturn((password: string): boolean => {
        if (password === tPassword) { return true; }
        return false;
      });
    assert.isTrue(networkFacade.signup(tPassword), 'signup is not working, should return true because the password should match');
    assert.isFalse(networkFacade.signup(tWrongPassword), 'signup is not working, should return false because the password does not match');
  });
  // TESTING LOGON
  it('testing logon function', () => {
    mockito.when(mockedSession.logon)
      .thenReturn((privateKey: string, password: string): boolean => {
        if (privateKey === tUserKey && password === tPassword) {
          return true;
        }
        return false;
      });
    assert.isTrue(networkFacade.logon(tUserKey, tPassword), 'logon is not working, should return true because the privateKey and password should match');
    assert.isFalse(networkFacade.logon(tUserKey, tWrongPassword), 'logon is not working, should return true because the privateKey and password should match');
  });
  it('testing getUserAccount', () => {
    mockito.when(mockedSession.getAccount)
      .thenReturn((password: string) => {
        if (password === tPassword) return [tUserAddress, tUserKey];
        throw new Error('Wrong input');
      });
    const result = networkFacade.getUserAccount(tPassword);
    assert.equal(result[0], tUserAddress);
    assert.equal(result[1], tUserKey);
  });
  it('testing createFunction', () => {
    const FunctionDefinition = {
      fnName: 'Function',
      description: 'description',
      pro: 'prototype',
      filePath: './prima.js',
      cost: 10,
    };

    mockito.when(mockedSession.isUserSignedIn).thenReturn(() => true);

    mockito.when(mockedNetwork.postRequest)
      .thenReturn((endpoint, body) => new Promise((resolve) => { resolve([200, '{"FunctionArn":"ok"}']); }));

    mockito.when(mockedContract.getFunctionTransaction)
      .thenReturn((FR) => new Promise((resolve) => {
        resolve(trs);
      }));

    mockito.when(mockedSession.signTransaction)
      .thenReturn((transaction, password) => new Promise((resolve, reject) => {
        if (password !== tPassword) reject(new Error('wrong password'));
        resolve('signed transaction');
      }));

    mockito.when(mockedNetwork.sendTransaction)
      .thenReturn((transaction) => new Promise((resolve) => {
        if (transaction === 'signed transaction') resolve('sent');
      }));

    networkFacade.createFunction(FunctionDefinition, tPassword).then((result) => {
      assert.ok(result, 'not done yet');
    });
  });
  it('testing getAllLoadedFunction', () => {
    mockito.when(mockedContract.getFunctionTransaction)
      .thenReturn((FR) => new Promise((resolve) => {
        resolve(trs);
      }));
    mockito.when(mockedNetwork.callMethod)
      .thenReturn((tr) => new Promise((resolve) => { resolve('to be decoded'); }));
    mockito.when(mockedContract.decodeResponse)
      .thenReturn((req, result) => 'decoded');
    networkFacade.getAllLoadedFunction().then((result) => {
      assert.ok(result, 'is not ok');
    }).catch(() => { console.log('error getAllLoadedFunction'); });
  });
  it('testing getFunctionDetails', () => {
    mockito.when(mockedContract.getFunctionTransaction)
      .thenReturn((FR) => new Promise((resolve) => {
        resolve(trs);
      }));
    mockito.when(mockedNetwork.callMethod)
      .thenReturn((tr) => new Promise((resolve) => { resolve('to be decoded'); }));
    mockito.when(mockedContract.decodeResponse)
      .thenReturn((req, result) => 'decoded');
    networkFacade.getAllLoadedFunction().then((result) => {
      assert.ok(result, 'is not ok');
    }).catch(() => { console.log('error getFunctionDetails'); });
  });
  it('testing getCostOfFunction', () => {
    mockito.when(mockedContract.getFunctionTransaction)
      .thenReturn((FR) => new Promise((resolve) => {
        resolve(trs);
      }));
    mockito.when(mockedNetwork.callMethod)
      .thenReturn((tr) => new Promise((resolve) => { resolve('to be decoded'); }));
    mockito.when(mockedContract.decodeResponse)
      .thenReturn((req, result) => 'decoded');
    networkFacade.getAllLoadedFunction().then((result) => {
      assert.ok(result, 'is not ok');
    });
  });
  it('testing runFunction', () => {
    mockito.when(mockedContract.getFunctionTransaction)
      .thenReturn((FR) => new Promise((resolve) => {
        resolve(trs);
      }));
    mockito.when(mockedNetwork.callMethod)
      .thenReturn((tr) => new Promise((resolve) => { resolve('to be decoded'); }));
    mockito.when(mockedContract.decodeResponse)
      .thenReturn((req, result) => 10);

    mockito.when(mockedSession.isUserSignedIn).thenReturn(() => true);

    mockito.when(mockedSession.signTransaction)
      .thenReturn((transaction, password) => new Promise((resolve, reject) => {
        if (password !== tPassword) reject(new Error('wrong password'));
        resolve('signed transaction');
      }));

    mockito.when(mockedNetwork.sendTransaction)
      .thenReturn((transaction) => new Promise((resolve) => {
        if (transaction === 'signed transaction') resolve('sent');
      }));

    mockito.when(mockedContract.getSignal)
      .thenReturn((sign, id) => new Promise((resolve) => {
        resolve('successful execution');
      }));

    networkFacade.runFunction('dummyFunction', '["arg1"]', tPassword).then((result) => {
      assert.ok(result, 'not done yet');
    }).catch(() => { console.log('error'); });
  });
  it('testing setFunctionProperty', () => {
    networkFacade.setFunctionProperty('functionName', 'prototype', 'prototype', tPassword)
      .then((result) => { assert.ok(result, 'not ok on setFunction'); });
  });
  it('testing deleteFunction', () => {
    networkFacade.deleteFunction('function', tPassword)
      .then((value) => { assert.ok(value); });
  });
  it('testing updateFunction', () => {
    mockito.when(mockedContract.decodeResponse)
      .thenReturn((req, result) => 'arn:aws:lambda:us-west-2:123456789012:function:my-function:TEST');
    networkFacade.updateFunction('function', './prima.js')
      .then((value) => { assert.ok(value); });
  });
  it('testing disconnect()', () => {
    mockito.when(mockedNetwork.disconnect).thenReturn(() => { });
    networkFacade.disconnect();
  });
});
