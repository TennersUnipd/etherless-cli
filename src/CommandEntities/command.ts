/**
 * @class Command
 * @interface CommandInputs
 * @file command.ts
 * this file contain the class definition of Command and
 * the definition of the structure CommandInputs
 */
import { NetworkFacade } from '../NetworkEntities/networkFacade';

export abstract class Command {
  protected COMMAND_NAME = 'COMMAND';

  protected COMMAND_ALIAS = 'ALIAS';

  protected COMMAND_DESCRIPTION = 'DESCRIPTION';

  protected network: NetworkFacade;

  /**
   * @abstract
   * @function exec
   * @param inputs required for the correct execution
   *  This abstract method is called for every execution.
   */

  abstract exec(inputs: CommandInputs): Promise<ExecutionResponse | string>;


  /**
   * @function parseArgs
   * @param args the arguments passed by the invocation.
   * @returns a type CommandInput or one of his extension
   * This method takes the arguments passed with the command line interface at the exec method.
   */
  // eslint-disable-next-line class-methods-use-this
  parseArgs(args: string[]): CommandInputs {
    if (args === undefined || args.length === 0) {
      return {};
    }
    throw new Error('Invalid parameters');
  }

  /**
   * @function getDescription()
   * @returns the content of COMMAND_NAME
   *  This method is used as getter of the variable COMMAND_NAME
   */
  getCommandDescriptor(): string {
    return this.COMMAND_NAME;
  }

  /**
   * @function getCommandAlias()
   * @returns the content of COMMAND_ALIAS
   *  This method is used as getter of the variable COMMAND_ALIAS
   */
  getCommandAlias(): string {
    return this.COMMAND_ALIAS;
  }

  /**
   * @function getDescription()
   * @returns the content of COMMAND_DESCRIPTION
   *  This method is used as getter of the variable COMMAND_DESCRIPTION
   */
  getDescription(): string {
    return this.COMMAND_DESCRIPTION;
  }

  /**
   * @function disconnect()
   * This method is needed at the end of the execution to close the connection with the network.
   */
  disconnect(): void {
    this.network.disconnect();
  }

  /**
   * @class
   * @param network required for the correct implementation, and exposes the dependency.
   * This method is used to define the dependency of the Commands object
   *  from the NetworkFacade and obliges the extenders to keep this dependency.
   */
  constructor(network: NetworkFacade) {
    this.network = network;
  }
}


export interface ExecutionResponse {
  response: string;
  logData?: object;
}

/**
 * @interface CommandInputs
 *  This interface is used as a structure to define the input for every command.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CommandInputs { }
