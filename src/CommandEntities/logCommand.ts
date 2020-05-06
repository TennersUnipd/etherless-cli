import { Command } from './command';

import Logger from '../log';

export default class LogCommand extends Command {
  COMMAND_NAME = 'log';

  COMMAND_ALIAS = 'll';

  COMMAND_DESCRIPTION = 'list of the latest 20 functions run logged';

  // eslint-disable-next-line class-methods-use-this
  exec(): Promise<string> {
    return new Promise((resolve, rejects) => {
      try {
        resolve(JSON.stringify(Logger.getLogs()));
      } catch (error) {
        rejects(error);
      }
    });
  }
}
