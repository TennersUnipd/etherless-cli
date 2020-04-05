import 'mocha';

import { assert } from 'chai';

import mockito from 'ts-mockito';

import { Command } from '../../../src/CommandEntities/command';
import LoginCommand from '../../../src/CommandEntities/loginCommand';
import { NetworkFacade } from '../../../src/NetworkEntities/networkFacade';


const mockFacade: NetworkFacade = mockito.mock(NetworkFacade);
const testPassword: string = 'testP';
const testPrivateKey: string = 'testPK';

describe('testing LoginTest', () => {
  const command:Command = new LoginCommand(mockito.instance(mockFacade));
  it('testing execution of Login', () => {
    mockito.when(mockFacade.logon('private key','password')).thenReturn(true);
    command.exec(command.parseArgs(['private key','password'])).then((result) => {
      assert.equal(result,'Logged in successfully', 'not ok');
    }).catch(console.error);
  });
  it('testing getCommandDescriptor()', () => {
    const result: string = command.getCommandDescriptor();
    assert.equal(result,'login <privateKey> <password>','Name is not the same');
  });
  it('testing getCommandAlias()', () => {
    const result: string = command.getCommandAlias();
    assert.equal(result,'lg','Alias is not the same');
  });
  it('testing getDescription()', () => {
    const result: string = command.getDescription();
    assert.equal(result,'Log in with an ethereum account','Description is not the same');
  });
});
