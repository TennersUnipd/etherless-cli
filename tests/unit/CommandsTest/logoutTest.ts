import 'mocha';

import {assert, expect} from 'chai';

import mockito from 'ts-mockito';

import { Command } from '../../../src/CommandEntities/command';
import LogoutCommand from '../../../src/CommandEntities/logoutCommand';
import { NetworkFacade } from '../../../src/NetworkEntities/networkFacade';

const mockFacade: NetworkFacade = mockito.mock(NetworkFacade);

describe('testing execution of Logout', () => {
    const command:Command = new LogoutCommand(mockFacade);
    /*mockito.when(mockFacade.logout()).thenReturn(new Promise<any>(resolve) => {
        resolve('Logout is working');
    });*/
});