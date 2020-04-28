/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import 'mocha';

import { assert } from 'chai';

import mockito, { mock } from 'ts-mockito';
import Utils from '../../../src/utils';
import { ContractInterface, Transaction } from '../../../src/NetworkEntities/contractInterface';
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
const tWrongPassword = '';
const trs: Transaction = {
  from: 'realAddress',
  to: 'realAddress',
  gas: 10,
  data: 'trueData',
};

mockito.when(mockedContract.isTheFunctionPayable).thenReturn((nFunction) => {
  if (nFunction === 'function 1') { return true; }
  return false;
});

mockito.when(mockedSession.getUserAddress).thenReturn(() => 'Indirizzo verissimo');

mockito.when(mockedSession.logout).thenReturn(() => { assert.call(mockedSession.logout, 'called another method'); });

mockito.when(mockedContract.getFunctionTransaction)
  .thenReturn((address, fname, args) => new Promise((resolve, reject) => {
    resolve(trs);
    reject(new Error('generic error'));
  }));

mockito.when(mockedNetwork.sendTransaction)
  .thenReturn((transaction: any) => new Promise((resolve, reject) => {
    resolve(true);
    reject(new Error('generic error sendTransaction'));
  }));

describe('testing networkFacade', () => {
  const networkFacade: NetworkFacade = new NetworkFacade(
    mockito.instance(mockedNetwork),
    mockito.instance(mockedSession),
    mockito.instance(mockedContract),
  );
  // TESTING SIGNUP
  it('testing signup function', async () => {
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
  it('testing getListOfFunctions', () => {
    mockito.when(mockedContract.getListOfFunctions).thenReturn(() => ['function 1', 'function 2']);
    const result = networkFacade.getListOfFunctions();
    assert.isArray(result, 'getListOfFunctions is not working');
    assert.isTrue(result.includes('function 1'), 'getListOfFunction doesn\'t report the correct array of function from the class Contract');
  });
});
