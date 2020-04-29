import { Command, CommandInputs } from './command';
import Utils from '../utils';

class DeleteCommand extends Command {
    COMMAND_NAME = 'delete <functionName> <password>';

    COMMAND_ALIAS = 'd';

    COMMAND_DESCRIPTION = 'Delete function';


    exec(inputs: DeleteCommandInputs): Promise<any> {
      return this.network.deleteFunction(inputs.function, inputs.password).then(response => {
        return "Done";
      });
    }

    // eslint-disable-next-line class-methods-use-this
    parseArgs(args: string[]): CommandInputs {
      return { function: args[0], password: args[1] };
    }
}

interface DeleteCommandInputs extends CommandInputs {
    function: string;
    password: string;
}

export default DeleteCommand;
