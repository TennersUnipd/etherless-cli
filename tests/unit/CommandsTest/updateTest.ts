import 'mocha';

import { assert } from 'chai';

import mockito from 'ts-mockito';

import { UpdateCommand/*, UpdateInputs*/ } from '../../../src/CommandEntities/updateCommand';

import { Command } from '../../../src/CommandEntities/command';
import { NetworkFacade, FunctionDefinition } from '../../../src/NetworkEntities/networkFacade';

const mockFacade: NetworkFacade = mockito.mock(NetworkFacade);

describe('testing Class UpdateTest', () =>{
    const command:Command = new UpdateCommand(mockito.instance(mockFacade));
    it('testing getCommandDescriptor()', () => {
        const result: string = command.getCommandDescriptor();
        assert.equal(result,'update <function> <file>','Name is not the same');
    });
    it('testing getCommandAlias()', () => {
        const result: string = command.getCommandAlias();
        assert.equal(result,'u','Alias is not the same');
    });
    it('testing getDescription()', () => {
        const result: string = command.getDescription();
        assert.equal(result,'Update function','Description is not the same');
    });
    it('testing execution of Update', () => {
        mockito.when(mockFacade.updateFunction(mockito.anything(), ' ')).thenReturn(new Promise((resolve, reject) => {
            resolve(['function updated']);
            reject(new Error('testError'));
        }));
        command.exec(command.parseArgs(['name', './tests/unit/CommandsTest/dummy.js'])).then((result)=> {
            console.log(result);
        }).catch(console.error);
    });
});