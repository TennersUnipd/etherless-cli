import 'mocha';

import { assert,expect } from 'chai';
import mockito from 'ts-mockito';
import ListCommand from '../../../src/CommandEntities/listCommand';
import { NetworkFacade } from '../../../src/NetworkEntities/networkFacade';
import { Command } from '../../../src/CommandEntities/command';


const mockFacade: NetworkFacade = mockito.mock(NetworkFacade);

describe('testing ListTest', () => {
  const command:Command = new ListCommand(mockito.instance(mockFacade));
  it('testing execution of List', () => {
    mockito.when(mockFacade.getAllLoadedFunction()).thenReturn(new Promise((resolve, reject) => {
      resolve(['function 1', 'function 2']);
      reject(new Error('testError'));
    }));
    command.exec(command.parseArgs([])).then((result) => {
      expect(result).to.include('function 1');
    }).catch(console.error);
  });
  
});
