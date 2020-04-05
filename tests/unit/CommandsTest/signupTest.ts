import 'mocha';

import {assert, expect} from 'chai';

import mockito from 'ts-mockito';

import { Command } from '../../../src/CommandEntities/command';
import SignUpCommand from '../../../src/CommandEntities/signupCommand';
import { NetworkFacade } from '../../../src/NetworkEntities/networkFacade';

const passwordT: string = 'password';

const mockFacade: NetworkFacade = mockito.mock(NetworkFacade);
describe('testing execution of SignUp', () => {
    const command:Command = new SignUpCommand(mockFacade);
    mockito.when(mockFacade.signup('password')).thenReturn(true);

    command.exec(command.parseArgs(['password'])).then((result) => {
        assert.equal(result,'Signed up successfully', 'not ok');
    }).catch(console.error);
    console.log(mockito.verify(mockFacade.signup('password')).called());
});