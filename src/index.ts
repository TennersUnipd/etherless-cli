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
const testAccountAddress = '0x491E061Dd3097De2FD7428f553228D13fA38308F';

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
    CMDList(gate, testAccountAddress);
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
      name: name,
      remoteResource: '',
      description: description,
      proto: prototype,
      cost: cost,
      file: file
    };

    CMDCreate(gate, testAccountAddress, params);
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
    CMDRun(gate, testAccountAddress, params);
  });

program.parse(process.argv);
