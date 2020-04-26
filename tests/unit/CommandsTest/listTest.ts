import 'mocha';

import { assert, expect } from 'chai';

import mockito from 'ts-mockito';

import { Command } from '../../../src/CommandEntities/command';
import ListCommand from '../../../src/CommandEntities/listCommand';
import { NetworkFacade } from '../../../src/NetworkEntities/networkFacade';


const mockFacade: NetworkFacade = mockito.mock(NetworkFacade);

describe('testing ListTest', () => {
  const command: Command = new ListCommand(mockito.instance(mockFacade));
  it('testing execution of List', () => {
    mockito.when(mockFacade.getAllLoadedFunction()).thenReturn(new Promise((resolve, reject) => {
      resolve({name:'function 1', cost:10,prototype:'void',description:'test description'});
      reject(new Error('testError'));
    }));
    command.exec(command.parseArgs([])).then((result) => {
      expect(result).to.include('function 1');
    }).catch((err)=>{
      console.log(err);
      assert.fail('ListTest failing');
    });
  });
  it('testing getCommandDescriptor()', () => {
    const result: string = command.getCommandDescriptor();
    assert.equal(result, 'list', 'Name is not the same');
  });
  it('testing getCommandAlias()', () => {
    const result: string = command.getCommandAlias();
    assert.equal(result, 'l', 'Alias is not the same');
  });
  it('testing getDescription()', () => {
    const result: string = command.getDescription();
    assert.equal(result, 'List of all functions available on Etherless', 'Description is not the same');
  });
});
