import 'mocha';

import { assert } from 'chai';

import mockito from 'ts-mockito';

import { Command } from '../../../src/CommandEntities/command';
import DeleteCommand from '../../../src/CommandEntities/deleteCommand';
import { NetworkFacade, FunctionDefinition } from '../../../src/NetworkEntities/networkFacade';

const mockFacade: NetworkFacade = mockito.mock(NetworkFacade);

describe('testing Class DeleteTest', () => {
  const command: Command = new DeleteCommand(mockito.instance(mockFacade));
  it('testing execution of Delete', () => {
    mockito.when(mockFacade.deleteFunction('function', 'password')).thenReturn(new Promise((resolve, reject) => {
      resolve('function deleted');
      reject(new Error('testError'));
    }));
    command.exec(command.parseArgs(['function', 'password'])).then((result) => {
      console.log(result);
    }).catch(console.error);
  });
  it('testing getCommandDescriptor()', () => {
    const result: string = command.getCommandDescriptor();
    assert.equal(result, 'delete <functionName> <password>');
  });
  it('testing getCommandAlias()', () => {
    const result: string = command.getCommandAlias();
    assert.equal(result, 'd');
  });
  it('testing getDescription()', () => {
    const result: string = command.getDescription();
    assert.equal(result, 'Delete function');
  });
});
