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
    mockito.when(mockFacade.runFunction('RemoteFunction', mockito.anyString(), 'password'))
      .thenReturn(new Promise((resolve, reject) => {
        resolve(JSON.stringify({
          fName: 'RemoteFunction',
          serializedParams: '[arg1,arg2]',
          cost: 10,
          elemen: {
            StatusCode: 200,
            Payload: 'execution result',
          },
        }));
        reject(new Error('testError'));
      }));
    command.exec(command.parseArgs(['RemoteFunction', 'password', 'arg1', 'arg2'])).then((result) => {
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
