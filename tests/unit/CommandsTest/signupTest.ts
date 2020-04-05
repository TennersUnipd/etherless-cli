import 'mocha';

import {assert} from 'chai';

import mockito from 'ts-mockito';

import { Command } from '../../../src/CommandEntities/command';
import SignUpCommand from '../../../src/CommandEntities/signupCommand';
import { NetworkFacade } from '../../../src/NetworkEntities/networkFacade';

const passwordT: string = 'password';

const mockFacade: NetworkFacade = mockito.mock(NetworkFacade);
describe('testing execution of SignUp', () => {
    const command:Command = new SignUpCommand(mockito.instance(mockFacade));
    it ('testing execution of SignUp', () =>{
        mockito.when(mockFacade.signup('password')).thenReturn(true);
        command.exec(command.parseArgs(['password'])).then((result) => {
            assert.equal(result,'Signed up successfully', 'not ok');
        }).catch(console.error);
        mockito.verify(mockFacade.signup('password')).called();
    });
    it('testing getCommandDescriptor()', () => {
        const result: string = command.getCommandDescriptor();
        assert.equal(result,'signup <password>','Name is not the same');
    });
    it('testing getCommandAlias()', () => {
        const result: string = command.getCommandAlias();
        assert.equal(result,'su','Alias is not the same');
    });
    it('testing getDescription()', () => {
        const result: string = command.getDescription();
        assert.equal(result,'Create a new account','Description is not the same');
    });
});