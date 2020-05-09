/**
 * @file createCommand.ts
 * @class CreateCommand
 * @package CommandEntities
 */
import { FunctionDefinition } from 'src/NetworkEntities/networkFacade';
import fs from 'fs';
import { Command, CommandInputs } from './command';

/**
 * @class
 * @extends Command
 * Implements the create command
 */
export class CreateCommand extends Command {
  COMMAND_NAME = 'create <name> <description> <prototype> <cost> <file> <password>';

  COMMAND_ALIAS = 'c';

  COMMAND_DESCRIPTION = 'Create a new function on Etherless';

  exec(inputs: CreateCommandInputs): Promise<string> {
    const functionToUpload: FunctionDefinition = {
      fnName: inputs.name,
      description: inputs.description,
      filePath: inputs.filePath,
      pro: inputs.prototype,
      cost: inputs.cost,
    };
    return this.network.createFunction(functionToUpload, inputs.password);
  }

  // eslint-disable-next-line class-methods-use-this
  parseArgs(args: string[]): CommandInputs {
    if (args[1].length >= 50) {
      throw new Error('Description too long');
    } else if (Number.isNaN(+args[3]) || (+args[3]) <= 0) {
      throw new Error('Cost not valid, is not a number or is negative');
    } else if (!fs.existsSync(args[4])) {
      throw new Error('No exiting path');
    }
    return {
      name: args[0],
      description: args[1],
      prototype: args[2],
      cost: args[3],
      filePath: args[4],
      password: args[5],
    };
  }
}

export interface CreateCommandInputs extends CommandInputs {
  name: string;
  description: string;
  prototype: string;
  cost: number;
  filePath: string;
  password: string;
}
