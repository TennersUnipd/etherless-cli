import { Command, CommandInputs } from './command';

class SetCommand extends Command {
  COMMAND_NAME = 'set <functionName> <property> <value> <password>';

  COMMAND_ALIAS = 's';

  COMMAND_DESCRIPTION = 'Change function property';


  exec(inputs: SetCommandInputs): Promise<string> {
    return this.network.setFunctionProperty(inputs.function, inputs.property, inputs.newValue, inputs.password).then((response) => 'Done');
  }

  // eslint-disable-next-line class-methods-use-this
  parseArgs(args: string[]): CommandInputs {
    return {
      function: args[0], property: args[1], newValue: args[2], password: args[3],
    };
  }
}

interface SetCommandInputs extends CommandInputs {
  function: string;
  property: string;
  newValue: string;
  password: string;
}

export default SetCommand;
