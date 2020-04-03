import { FunctionDefinition } from 'src/NetworkEntities/networkFacade';
import { Command, CommandInputs } from './command';
import Utils from '../utils';


export class CreateCommand extends Command {
    COMMAND_NAME = 'create <name> <description> <prototype> <cost> <file> <password>';

    COMMAND_ALIAS = 'c';

    COMMAND_DESCRIPTION = 'Create a new function on Etherless';

    exec(inputs: CreateCommandInputs): Promise<any> {
      const compressedFile = Utils.compressFile(inputs.filePath);
      const functionToUpload: FunctionDefinition = {
        fnName: inputs.name,
        description: inputs.description,
        bufferFile: compressedFile,
        pro: inputs.prototype,
        cost: inputs.cost,
      };
      return this.network.createFunction(functionToUpload, inputs.password);
    }

    // eslint-disable-next-line class-methods-use-this
    parseArgs(args: string[]): CommandInputs {
      return {
        name: args[0], description: args[1], prototype: args[2], cost: args[3], filePath: args[4], password: args[5],
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
