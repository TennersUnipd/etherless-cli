import { Command, CommandInputs } from './command';

class ListCommand extends Command {
    COMMAND_NAME = 'list';

    COMMAND_ALIAS = 'l';

    COMMAND_DESCRIPTION = 'List of all funztions available on Etherless';

    exec(inputs: CommandInputs): Promise<any> {
      const contractFn = this.network.getContractMethods().listFunctions();
      return this.network.executeContractMethod(contractFn);
    }
}

export default ListCommand;
