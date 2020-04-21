import { Command, CommandInputs } from './command';

class FindCommand extends Command {
  COMMAND_NAME = 'find <function>';

  COMMAND_ALIAS = 'f';

  COMMAND_DESCRIPTION = 'Get function details';

  exec(inputs: FindInputs): Promise<any> {
    return this.network.getFunctionDetails(inputs.functionName)
      .then((command) => `Name: ${command.name}
        \nCost: ${command.cost}
        \nPrototype: ${command.prototype}
        \nDescription: ${command.description}
        \nOwner: ${command.owner}\n`)
      .catch(() => 'Function not found');
  }

  // eslint-disable-next-line class-methods-use-this
  parseArgs(args: string[]): FindInputs {
    return { functionName: args[0] };
  }
}


interface FindInputs extends CommandInputs {
  functionName: string;
}

export default FindCommand;
