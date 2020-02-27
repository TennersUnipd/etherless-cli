#!/usr/bin/env node
require('dotenv').config()

const program = require('commander')
const fs = require('fs')
import { CMDList } from './commands/list'
import { CMDCreate, CreateFNReqData } from './commands/create'
import { EnvType, getConfiguration } from './configurator'
import { Gateway } from './gateway'
import { RunFNData, CMDRun } from './commands/run'
import { createFunction } from './aws'

const environment: EnvType = EnvType.Local;
const testAccountAddress = "0x6f4B5D78A408B66f46eB168aD66B1E56895d9fA6";

let gate = getGateway(environment);

program
  .version('0.0.1')
  .description('Etherless CLI')

program
  .command('list')
  .alias('l')
  .description('List all available functions')
  .action(() => {
    CMDList(gate, testAccountAddress)
  })

program
  .command('create <name> <description> <prototype> <cost> <file>')
  .alias('c')
  .description('Create a new function')
  .action((name: string, description: string, prototype: string, cost: number, file: string) => {
    // TODO: check inputs

    // check if file exists
    if (!fs.existsSync(file)) {
      console.error("Function file not found");
      return
    }

    var params: CreateFNReqData = {
      name: name,
      remoteResource: "",
      description: description,
      proto: prototype,
      cost: cost
    }

    createFunction(name, file).then(function (result: any) {
      params.remoteResource = result["FunctionArn"];
      CMDCreate(gate, testAccountAddress, params);
      // TODO: if contract fn cration fails, delete lambda function (randomize lambda fn name as hotfix)
    }, console.error);
  })

program
  .command('run <functionName> [parameters...]')
  .alias('r')
  .description('Request function execution')
  .action((name: string, parameters: string[]) => {
    // TODO: check inputs
    let params: RunFNData = {
      name: name,
      parameters: parameters
    }
    console.log(params);
    CMDRun(gate, testAccountAddress, params);
  })

program.parse(process.argv)

function getGateway(env: EnvType): Gateway {
  let config = getConfiguration(env);
  return new Gateway(config);
}