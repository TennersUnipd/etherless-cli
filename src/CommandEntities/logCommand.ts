import { Command } from './command';

const fs = require('fs');

class LogCommand extends Command {
  COMMAND_NAME = 'log';

  COMMAND_ALIAS = 'll';

  COMMAND_DESCRIPTION = 'list of the latest 20 functions run logged';

  exec(): Promise<any> {
    return new Promise((resolve, rejects) => {
      try {
        console.log(`${this.COMMAND_NAME} running...`);
        resolve(JSON.parse(fs.readFileSync('logs.json', 'utf-8')));
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

export default LogCommand;
