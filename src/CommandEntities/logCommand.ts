/**
 * @file logCommand.ts
 * @class LogCommand
 * @package CommandEntities
 */
import { Command } from './command';
import Logger from '../logger';

/**
 * @class
 * @extends Command
 * Implements the log command
 */
export default class LogCommand extends Command {
  COMMAND_NAME = 'log';

  COMMAND_ALIAS = 'll';

  COMMAND_DESCRIPTION = 'list of the latest 20 functions run logged';

  // eslint-disable-next-line class-methods-use-this
  exec(): Promise<string> {
    return new Promise((resolve, rejects) => {
      try {
        let logResult = '';
        const logsContent = JSON.parse(JSON.stringify(Logger.getLogs()));
        logsContent.forEach((item) => {
          const objectKeys = Object.keys(item);
          objectKeys.forEach((k) => {
            logResult = `${logResult}\n${k}: ${item[k]}`;
          });
          logResult += '\n';
        });
        resolve(logResult);
      } catch (error) {
        rejects(error);
      }
    });
  }
}
