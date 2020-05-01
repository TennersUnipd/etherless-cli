import 'mocha';

import { assert, expect } from 'chai';

import mockito from 'ts-mockito';

import { Command } from '../../../src/CommandEntities/command';
import LogoutCommand from '../../../src/CommandEntities/logoutCommand';
import { NetworkFacade } from '../../../src/NetworkEntities/networkFacade';

const mockFacade: NetworkFacade = mockito.mock(NetworkFacade);

describe('testing execution of Logout', () => {
  const command: Command = new LogoutCommand(mockito.instance(mockFacade));
  it('testing execution of Loguot', () => {
    mockito.when(mockFacade.logout()).thenCall(() => { assert.isTrue(true, 'should be true'); });
    command.exec(command.parseArgs([])).then((result) => {
      assert.equal(result, 'Logged out', 'not ok');
    });
    mockito.verify(mockFacade.logout()).called();
  });
  it('testing getCommandDescriptor()', () => {
    const result: string = command.getCommandDescriptor();
    assert.equal(result, 'logout', 'Name is not the same');
  });
  it('testing getCommandAlias()', () => {
    const result: string = command.getCommandAlias();
    assert.equal(result, 'lo', 'Alias is not the same');
  });
  it('testing getDescription()', () => {
    const result: string = command.getDescription();
    assert.equal(result, 'Logout from your account', 'Description is not the same');
  });
});
