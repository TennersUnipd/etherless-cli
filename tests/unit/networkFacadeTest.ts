import 'mocha';
import { assert } from 'chai';
import { AxiosResponse } from 'axios';
import mockito from 'ts-mockito';
import SessionInterface from '../../src/NetworkEntities/SessionInterface';
import NetworkInterface from '../../src/NetworkEntities/networkInerface';
import { ContractInterface } from '../../src/NetworkEntities/contractInterface';
import NetworkComponentsFacade from '../../src/NetworkEntities/NetworkFacade';

// Creating mock
const mockedNetwork:NetworkInterface = mockito.mock(NetworkInterface);
const mockedSession:SessionInterface = mockito.mock(SessionInterface);
const mockedContract:ContractInterface = mockito.mock(ContractInterface);


mockito.when(mockedContract.isTheFunctionPayable).thenReturn((nFunction) => {
  if (nFunction === 'function 1') { return true; }
  return false;
});

mockito.when(mockedSession.getUserAddress).thenReturn(() => 'Indirizzo verissimo');

mockito.when(mockedContract.getFunctionTransaction).thenReturn((address, fname, args) => new Promise((resolve, reject) => {
  resolve({ transazione: true, isValid: 'sure' });
  reject(new Error('generic error'));
}));

mockito.when(mockedNetwork.sendTransaction).thenReturn((transaction:any) => new Promise((resolve, reject) => {
  resolve(true);
  reject(new Error('generic error sendTransaction'));
}));

describe('testing networkFacade', () => {
  const networkFacade: NetworkComponentsFacade = new NetworkComponentsFacade(mockito.instance(mockedNetwork),
    mockito.instance(mockedSession), mockito.instance(mockedContract));
  it('testing signup function', async () => {
    // stub method before execution
    mockito.when(mockedSession.signup).thenReturn((password:string) => new Promise<boolean>((resolve) => {
      if (password !== 'ciao') {
        resolve(false);
      } else {
        resolve(true);
      }
    }));
    const result = await networkFacade.signup('ciao');
    assert.isTrue(result, 'ciccia');
  });
  it('testing logon function', async () => {
    mockito.when(mockedSession.logon).thenReturn((address:string, password:string) => new Promise<boolean>((resolve) => {
      if (address !== 'ciao' && password !== 'hey') {
        resolve(false);
      } else {
        resolve(true);
      }
    }));
    const result = await networkFacade.logon('ciao', 'hey');
    assert.isTrue(result, 'ciccia');
  });
  it('testing getListOfFunctions', () => {
    mockito.when(mockedContract.getListOfFunctions).thenReturn(() => ['funzione 1', 'funzione 2']);
    const result = networkFacade.getListOfFunctions();
    assert.isArray(result, 'getListOfFunctions is not working');
    assert.isTrue(result.includes('funzione 1'), 'getListofFucntiuon lavllalalalal');
  });
  it('testing callFunction function', async () => {
    const result = await networkFacade.callFunction('funzione 1', ['test']);
    assert.isTrue(result, 'ciccia');
  });
});
