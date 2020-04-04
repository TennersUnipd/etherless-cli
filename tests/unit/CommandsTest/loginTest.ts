import 'mocha';

import { assert,expect } from 'chai';

import mockito from 'ts-mockito';

import { Command } from '../../../src/CommandEntities/command';
import LoginCommand from '../../../src/CommandEntities/loginCommand';
import { NetworkFacade } from '../../../src/NetworkEntities/networkFacade';


const mockFacade: NetworkFacade = mockito.mock(NetworkFacade);
const testPassword: string = 'testP';
const testPrivateKey: string = 'testPK';

describe('testing ListTest', () => {
  const command:Command = new LoginCommand(mockito.instance(mockFacade));
  it('testing execution of Login', () => {
    mockito.when(mockFacade.logon('private key','password'))
    /*.thenReturn(boolean => {
        if (privatek === testPrivateKey && passwordt === testPassword) {
            return true;
        }
        return false;*/
    });
    /*mockito.when(mockFacade.logon('bhj','hdfhkf')).thenReturn(new Promise<boolean>((resolve, reject) => {
      resolve('login ok');
      reject(new Error('testError'));
    }));*/
    command.exec(command.parseArgs(['private key','password'])).then((result) => {
        console.log(result);
    }).catch(console.error);
  });
  
});
