import 'mocha';

import { assert } from 'chai';

import Ganache from 'ganache-core';
import NetworkComponentsFacade from '../../src/NetworkEntities/NetworkFacade';
import NetworkUtils from '../../src/NetworkEntities/NetworkUtils';
import SessionInterface from '../../src/NetworkEntities/SessionInterface';
import { ContractInterface } from '../../src/NetworkEntities/contractInterface';
import EtherlessContract from '../../src/NetworkEntities/etherlessContract';
import EtherlessNetwork from '../../src/NetworkEntities/etherlessNetwork';
import EtherlessSession from '../../src/NetworkEntities/etherlessSession';
import NetworkInterface from '../../src/NetworkEntities/networkInerface';
import * as variables from '../unit/SharedVariables';


const endpoint = Ganache.provider();
const network: NetworkInterface = new EtherlessNetwork(endpoint);
const session: SessionInterface = new EtherlessSession(endpoint);
const contract: ContractInterface = new EtherlessContract(variables.dummyAbi, variables.contractAddress, endpoint);

describe('NetworkFacade interface\'s integration test', () => {
  const networkF: NetworkComponentsFacade = new NetworkComponentsFacade(network, session, contract);
  it('testing signup', async () => {
    const result = await networkF.signup('test1');
    assert.isTrue(result, 'signup does not working');
    // console.log(session.getUserAddress());
  });
  // it('testing login', async () => {
  // messaggio di errore Uncaught Error: Couldn't import the private key
  // Error: Returned error: private key length is invalid
  //   const result = await networkF.logon('0x3551589371808E58B39075dFa61aF109bAA9fD0d', 'test1');
  //   assert.isTrue(result, 'login is not working');
  // });
  it('testing getListOfFunctions', () => {
    const result = networkF.getListOfFunctions();
    result.forEach((elements) => {
      console.log(elements);
    });
    assert.isArray(result, 'getListOfFunctions is not working');
    assert.isTrue(result.includes('function1'));
  });
  it('testing callFunction', async () => {
  // UnhandledPromiseRejectionWarning: TypeError: Cannot read property '1' of undefined
  // at EtherlessContract.getArgumentsOfFunction
  // 1) testing networkFacade interface
  // testing callFunction:
  // Error: The send transactions "from" field must be defined!
    const result = await networkF.callFunction('createFunction', ['function2']);
    assert.isObject(result, 'maybe there is a error, try again');
  });
});
