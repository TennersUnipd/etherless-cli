import 'mocha';

import { assert } from 'chai';

import mockito from 'ts-mockito';

import { Command } from '../../../src/CommandEntities/command';
import RunCommand from '../../../src/CommandEntities/runCommand';
import { NetworkFacade } from '../../../src/NetworkEntities/networkFacade';


const mockFacade: NetworkFacade = mockito.mock(NetworkFacade);

describe('testing Class RunTest', () => {
  const command:Command = new RunCommand(mockito.instance(mockFacade));
  it('testing execution of Run', () => {
    mockito.when(mockFacade.runFunction('RemoteFunction', mockito.anyString(), 'password')).thenReturn(new Promise((resolve, reject) => {
      console.log('called');
      resolve('execution result');
      reject(new Error('testError'));
    }));
  });
  command.exec(command.parseArgs(['RemoteFunction', 'password', 'arg1', 'arg2']));
});
