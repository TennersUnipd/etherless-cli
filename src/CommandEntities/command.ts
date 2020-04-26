/**
 * @class Command
 * @interface CommandInputs
 * @file command.ts
 * @brief this file contain the class definition of Command and the definition of the structure CommandInputs
 */
import { NetworkFacade } from '../NetworkEntities/networkFacade';
import NetworkUtils from '../NetworkEntities/networkUtils';
/**
 * @abstract
 * @class Command
 * @brief This class is used as definition of any command.
 */
export abstract class Command {
  protected COMMAND_NAME = 'COMMAND';

  protected COMMAND_ALIAS = 'ALIAS';

  protected COMMAND_DESCRIPTION = 'DESCRIPTION';

  protected network: NetworkFacade;

  /**
     * @abstract
     * @method exec
     * @param inputs required for the correct execution
     * @brief This abstract method is called for every execution.
     */

  abstract exec(inputs: CommandInputs): Promise<any>;


  /**
     * @method parseArgs
     * @param args the arguments passed by the invocation.
     * @returns a type CommandInput or one of his extension
     * @brief This method takes the arguments passed with the command line interface at the exec method.
     */
  // eslint-disable-next-line class-methods-use-this
  parseArgs(args: string[]): CommandInputs {
    if (args === undefined || args.length === 0) {
      return {};
    }
    throw new Error('Invalid parameters');
  }

  /**
     * @method getDescription()
     * @returns the content of COMMAND_NAME
     * @brief This method is used as getter of the variable COMMAND_NAME
     */
  getCommandDescriptor(): string {
    return this.COMMAND_NAME;
  }

  /**
     * @method getCommandAlias()
     * @returns the content of COMMAND_ALIAS
     * @brief This method is used as getter of the variable COMMAND_ALIAS
     */
  getCommandAlias(): string {
    return this.COMMAND_ALIAS;
  }

  /**
     * @method getDescription()
     * @returns the content of COMMAND_DESCRIPTION
     * @brief This method is used as getter of the variable COMMAND_DESCRIPTION
     */
  getDescription(): string {
    return this.COMMAND_DESCRIPTION;
  }

  /**
     * @method disconnect()
     * @brief This method is needed at the end of the execution to close the connection with the network.
     */
  disconnect(): void {
    this.network.disconnect();
  }

  /**
     * @constructor
     * @param network required for the correct implementation, and exposes the dependency.
     * @brief This method is used to define the dependency of the Commands object from the NetworkFacade and obliges the extenders to keep this dependency.
     */
  constructor(network: NetworkFacade) {
    this.network = network;
  }
}

/**
 * @interface CommandInputs
 * @brief This interface is used as a structure to define the input for every command.
 */
export interface CommandInputs {

}
