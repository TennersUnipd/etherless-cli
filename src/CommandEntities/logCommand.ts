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
        let logResult = '';
        const logsContent = JSON.parse(fs.readFileSync('logs.json', 'utf-8'));
        logsContent.forEach((item) => {
          const objectKeys = Object.keys(item);
          objectKeys.forEach((k) => {
            logResult = `${logResult}\n${k}: ${item[k]}`;
          });
          logResult += '\n';
        })
        resolve(logResult);
      } catch (error) {
        if (error.code === 'ENOENT') {
          rejects(new Error('No functions run and no log generated'));
        } else {
          rejects(new Error('generic error'));
        }
      }
    });
  }
}
