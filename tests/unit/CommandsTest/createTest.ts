import 'mocha';

import { assert } from 'chai';

import mockito from 'ts-mockito';

import { Command } from '../../../src/CommandEntities/command';
import { CreateCommand, CreateCommandInputs } from '../../../src/CommandEntities/createCommand';
import { NetworkFacade, FunctionDefinition } from '../../../src/NetworkEntities/networkFacade';

const mockFacade: NetworkFacade = mockito.mock(NetworkFacade);
//1) testing Class CreateTest
//testing execution of Create:
//Error: ENOENT: no such file or directory, open 'dummy.js'
describe('testing Class CreateTest', () =>{
    const command:Command = new CreateCommand(mockito.instance(mockFacade));
    it('testing execution of Create', () =>{
        mockito.when(mockFacade.createFunction(mockito.anything(),'password')).thenReturn(new Promise((resolve, reject) => {
            resolve(['new function created']);
            reject(new Error('testError'));
        }));
        command.exec(command.parseArgs(['name', 'description', 'prototype', '10', './dummy.js', 'password'])).then((result) =>{
            console.log(result);
        }).catch(console.error);
    });
});