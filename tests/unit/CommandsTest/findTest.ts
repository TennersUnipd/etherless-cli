import 'mocha';

import { assert,expect } from 'chai';

import mockito from 'ts-mockito';

import { Command } from '../../../src/CommandEntities/command';
import FindCommand from '../../../src/CommandEntities/findCommand';
import { NetworkFacade } from '../../../src/NetworkEntities/networkFacade';


const mockFacade: NetworkFacade = mockito.mock(NetworkFacade);

describe('testing FindTest', () => {
  const command:Command = new FindCommand(mockito.instance(mockFacade));
  it('testing execution of find', () => {
    mockito.when(mockFacade.getFunctionDetails('function1')).thenReturn(new Promise((resolve, reject) => {
      resolve({
          name:'function1',
          cost:'2',
          prototype:'null',
          description:'function test',
          owner:'fakeOwner'
      });
      reject(new Error('testError'));
    }));
    command.exec(command.parseArgs(['function1'])).then((result) => {
      expect(result).to.include('function1');
    }).catch(console.error);
  });
  it('testing getCommandDescriptor()', () => {
    const result: string = command.getCommandDescriptor();
    assert.equal(result,'find <function>','Name is not the same');
  });
  it('testing getCommandAlias()', () => {
    const result: string = command.getCommandAlias();
    assert.equal(result,'f','Alias is not the same');
  });
  it('testing getDescription()', () => {
    const result: string = command.getDescription();
    assert.equal(result,'Get function details','Description is not the same');
  });
});
