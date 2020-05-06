import 'mocha';

import { assert } from 'chai';

import mockito from 'ts-mockito';

import { Command } from '../../../src/CommandEntities/command';
import LoginCommand from '../../../src/CommandEntities/loginCommand';
import { NetworkFacade } from '../../../src/NetworkEntities/networkFacade';


const mockFacade: NetworkFacade = mockito.mock(NetworkFacade);
const testPassword = 'testP';
const testPrivateKey = '0x8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f';

describe('testing LoginTest', () => {
  const command: Command = new LoginCommand(mockito.instance(mockFacade));
  it('testing execution of Login', () => {
    try {
      mockito.when(mockFacade.logon(testPrivateKey, 'password')).thenReturn(true);
      command.exec(command.parseArgs([testPrivateKey, 'password'])).then((result) => {
        assert.equal(result, 'Logged in successfully', 'not ok');
      }).catch(console.error);
    } catch {
      assert.fail('Execution login doesn\'t work');
    }
  });
  it('testing getCommandDescriptor()', () => {
    const result: string = command.getCommandDescriptor();
    assert.equal(result, 'login <privateKey> <password>', 'Name is not the same');
  });
  it('testing getCommandAlias()', () => {
    const result: string = command.getCommandAlias();
    assert.equal(result, 'lg', 'Alias is not the same');
  });
  it('testing getDescription()', () => {
    const result: string = command.getDescription();
    assert.equal(result, 'Log in with an ethereum account', 'Description is not the same');
  });
});
