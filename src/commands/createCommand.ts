import { Command, CommandInput, CommandInputs } from './command';
import Utils from '../utils';

export class CreateCommand extends Command {
    COMMAND_NAME = 'create <name> <description> <prototype> <cost> <file>';

    COMMAND_ALIAS = 'c';

    COMMAND_DESCRIPTION = 'Create a new function on Etherless';

    exec(inputs: CreateCommandInputs): Promise<any> {
      return new Promise<any>((resolve, reject) => {
        const compressedFile = Utils.compressFile(inputs.filePath);
        this.network.uploadFunction(compressedFile)
          .then((remoteResource: string) => {
            const contractFn = this.network.getContractMethods()
              .createFunction(inputs.name,
                inputs.description,
                inputs.prototype,
                remoteResource,
                inputs.cost);
            this.network.executeContractMethod(contractFn).then(resolve).catch(reject);
          }).catch(reject);
      });
    }

    // eslint-disable-next-line class-methods-use-this
    parseArgs(args: string[]): CommandInputs {
      return {
        name: args[0], description: args[1], prototype: args[2], cost: args[3], filePath: args[4],
      };
    }
}

export interface CreateCommandInputs extends CommandInputs {
    name: string;
    description: string;
    prototype: string;
    cost: number;
    filePath: string;
}
