#!/usr/bin/env node
import { CMDList } from './commands/list';
import { CMDCreate, CreateFNReqData } from './commands/create';
import { EnvType, getConfiguration } from './configurator';
import { Gateway } from './gateway';
import { RunFNData, CMDRun } from './commands/run';

require('dotenv').config();

const program = require('commander');
const fs = require('fs');

const environment: EnvType = EnvType.Local;

function getGateway(env: EnvType): Gateway {
  const config = getConfiguration(env);
  return new Gateway(config);
}

const gate = getGateway(environment);

program
  .version('0.0.1')
  .description('Etherless CLI');

program
  .command('list')
  .alias('l')
  .description('List all available functions')
  .action(() => {
    CMDList(gate, gate.testAccount);
  });

program
  .command('create <name> <description> <prototype> <cost> <file>')
  .alias('c')
  .description('Create a new function')
  .action((name: string, description: string, prototype: string, cost: number, file: string) => {
    // TODO: check inputs

    // check if file exists
    if (!fs.existsSync(file)) {
      console.error('Function file not found');
      return;
    }

    const params: CreateFNReqData = {
      name,
      remoteResource: '',
      description,
      proto: prototype,
      cost,
      file,
    };

    CMDCreate(gate, gate.testAccount, params);
  });

program
  .command('run <functionName> [parameters...]')
  .alias('r')
  .description('Request function execution')
  .action((name: string, parameters: string[]) => {
    // TODO: check inputs
    const params: RunFNData = {
      name,
      parameters,
    };
    console.log(params);
    CMDRun(gate, gate.testAccount, params);
  });

program.parse(process.argv);


process.on('exit', () => {
  gate.disconnect();
});
process.on('SIGINT', () => {
  process.exit();
});
