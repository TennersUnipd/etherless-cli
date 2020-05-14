/**
 * @file deleteCommand.ts
 * @class DeleteCommand
 * @package CommandEntities
 */
import { Command, CommandInputs } from './command';

/**
 * @class
 * @extends Command
 * Implements the delete command
 */
class DeleteCommand extends Command {
  COMMAND_NAME = 'delete <functionName> <password>';

  COMMAND_ALIAS = 'd';

  COMMAND_DESCRIPTION = 'Delete function';


  exec(inputs: DeleteCommandInputs): Promise<string> {
    return this.network.deleteFunction(inputs.function, inputs.password).then(() => 'Done');
  }

  // eslint-disable-next-line class-methods-use-this
  parseArgs(args: string[]): DeleteCommandInputs {
    return { function: args[0], password: args[1] };
  }
}

interface DeleteCommandInputs extends CommandInputs {
  function: string;
  password: string;
}

export default DeleteCommand;
