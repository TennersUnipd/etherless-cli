import { NetworkFacade } from '../NetworkEntities/networkFacade';
import NetworkUtils from '../NetworkEntities/networkUtils';

export abstract class Command {
    protected COMMAND_NAME: string = 'COMMAND';

    protected COMMAND_ALIAS: string = 'ALIAS';

    protected COMMAND_DESCRIPTION: string = 'DESCRIPTION';

    protected network: NetworkFacade;

    abstract exec(inputs: CommandInputs) : Promise<any>;

    // eslint-disable-next-line class-methods-use-this
    parseArgs(args: string[]): CommandInputs {
      if (args === undefined || args.length === 0) {
        return {};
      }
      throw new Error('Invalid parameters');
    }

    getCommandDescriptor() : string {
      return this.COMMAND_NAME;
    }

    getCommandAlias() : string {
      return this.COMMAND_ALIAS;
    }

    getDescription() : string {
      return this.COMMAND_DESCRIPTION;
    }

    disconnect() : void {
      this.network.disconnect();
    }

    constructor(network:NetworkFacade) {
      this.network = network;
    }
}

export interface CommandInputs {

}
