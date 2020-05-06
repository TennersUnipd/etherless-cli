import 'mocha';

import { assert } from 'chai';

import mockito from 'ts-mockito';

import { Command } from '../../../src/CommandEntities/command';
import RunCommand from '../../../src/CommandEntities/runCommand';
import { NetworkFacade } from '../../../src/NetworkEntities/networkFacade';


const mockFacade: NetworkFacade = mockito.mock(NetworkFacade);

describe('testing Class RunTest', () => {
  const command: Command = new RunCommand(mockito.instance(mockFacade));
  it('testing execution of Run', () => {
    const param = mockito.anyString();
    mockito.when(mockFacade.runFunction('RemoteFunction', param, 'password')).thenReturn(new Promise((resolve) => {
      resolve(JSON.stringify({ elemen: { StatusCode: 200, Payload: 'execution result' } }));
    }).catch((err) => {
      assert.fail();
    }));
    command.exec(command.parseArgs(['RemoteFunction', 'password', param])).then((result) => {
      assert.equal(result, 'execution result', 'not ok');
    });
  });
  it('testing getCommandDescriptor()', () => {
    const result: string = command.getCommandDescriptor();
    assert.equal(result, 'run <functionName> <password> [parameters...]', 'Name is not the same');
  });
  it('testing getCommandAlias()', () => {
    const result: string = command.getCommandAlias();
    assert.equal(result, 'r', 'Alias is not the same');
  });
  it('testing getDescription()', () => {
    const result: string = command.getDescription();
    assert.equal(result, 'Request function execution', 'Description is not the same');
  });
});
