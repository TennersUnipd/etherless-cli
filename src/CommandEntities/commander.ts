/* eslint-disable no-console */
/**
 * @file commander.ts
 * @author TennersUnipd
 * @class Commander
 */
import commander from 'commander';
import { Command, ExecutionResponse } from './command';
import Logger from '../logger';

/**
 * @class
 * @static
 * It's a collection of static functions that initialize the library commander
 */
export default class Commander {
  private static VERSION = '4.0.0';

  private static DESCRIPTION = 'Etherless CLI';

  /**
   * @static
   * @function config()
   *  This static method is needed for initialization of the external library Commander
   */
  static config(): void {
    commander
      .name('etherless')
      .version('4.0.0')
      .description('Etherless CLI');
  }

  /**
   * @static
   * @function addCommand()
   * @param cmd
   * @function This static method adds to the external library Commander a new command.
   */
  static addCommand(cmd: Command): void {
    commander
      .command(cmd.getCommandDescriptor())
      .alias(cmd.getCommandAlias())
      .description(cmd.getDescription())
      .action(() => {
        const inputs = cmd.parseArgs(commander.args);
        if (commander.args.length === 0) commander.args[0] = 'true';
        cmd.exec(inputs)
          .then((result: ExecutionResponse | string) => {
            let response;
            if (typeof result !== 'string') {
              response = result.response;
              if (result.logData) {
                Commander.logActions(result.logData);
              }
            } else {
              response = result;
            }
            console.log(response);
          }).catch((error) => {
            console.error(`${error.message} \nFor other information about the command type etherless -h`);
          })
          .finally(() => {
            cmd.disconnect();
          });
      });
  }

  /**
   * @static
   * @function logActions
   * @param logData
   * logs the actions of the user
   */
  static logActions(logData: object): void {
    Logger.addLog(logData);
  }

  /**
   * @static
   * @function start() stars the service that reads the users' inputs
   * reads the users' inputs and checks if the command requested exists
   */
  static start(): void {
    commander.on('command:*', (operands) => {
      const availableCommands = commander.commands.map((cmd) => cmd.name());
      const filt = availableCommands.filter((command: string) => command === operands[0]);
      if (filt.length === 0) throw new Error(`${operands[0]} command not found`);
    });
    commander.parse(process.argv);
    if (commander.args.length === 0) commander.help();
  }
}
