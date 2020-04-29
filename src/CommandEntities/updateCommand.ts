//import { FunctionDefinition } from 'src/NetworkEntities/networkFacade';

import Utils from '../utils';

import { Command, CommandInputs } from './command';

export class UpdateCommand extends Command{
    COMMAND_NAME = 'update <function> <file>';

    COMMAND_ALIAS = 'u';

    COMMAND_DESCRIPTION = 'Update function';

    exec(inputs:UpdateInputs):Promise<any>{
        return this.network.updateFunction(inputs.functionName, inputs.filePath);
    }

    parseArgs(args: string[]): UpdateInputs {
        return { functionName: args[0], filePath: args[1]};
      }
}

interface UpdateInputs extends CommandInputs{
    functionName: string;
    filePath: string;
}

export default UpdateCommand;