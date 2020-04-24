import { FunctionDefinition } from 'src/NetworkEntities/networkFacade';

import Utils from '../utils';

import { Command, CommandInputs } from './command';

export class UpdateCommand extends Command{
    COMMAND_NAME = 'update <function>';

    COMMAND_ALIAS = 'u';

    COMMAND_DESCRIPTION = 'Update function';

    exec(input:UpdateInputs):Promise<any>{
        return this.network.updateFunction(input.functionName);
    }

    parseArgs(args: string[]): UpdateInputs {
        return { functionName: args[0] };
      }
}

interface UpdateInputs extends CommandInputs{
    functionName: string;
}

export default UpdateCommand;