import 'mocha';

import { assert } from 'chai';

import mockito from 'ts-mockito';

import { Command } from '../../../src/CommandEntities/command';
import SetCommand from '../../../src/CommandEntities/setCommand';
import { NetworkFacade, FunctionDefinition } from '../../../src/NetworkEntities/networkFacade';

const mockFacade: NetworkFacade = mockito.mock(NetworkFacade);

describe('testing Class SetTest', () => {
  const command: Command = new SetCommand(mockito.instance(mockFacade));
  it('testing execution of Set', () => {
    mockito.when(mockFacade.setFunctionProperty('function', 'property', 'newValue', 'password')).thenReturn(new Promise((resolve, reject) => {
      resolve('function setted');
      reject(new Error('testError'));
    }));
    command.exec(command.parseArgs(['function', 'property', 'newValue', 'password'])).then((result) => {
      console.log(result);
    }).catch(console.error);
  });
  it('testing getCommandDescriptor()', () => {
    const result: string = command.getCommandDescriptor();
    assert.equal(result, 'set <functionName> <property> <value> <password>');
  });
  it('testing getCommandAlias()', () => {
    const result: string = command.getCommandAlias();
    assert.equal(result, 's');
  });
  it('testing getDescription()', () => {
    const result: string = command.getDescription();
    assert.equal(result, 'Change function property');
  });
});
