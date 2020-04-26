import { Command } from './command';

class LogCommand extends Command {
  COMMAND_NAME = 'log';

  COMMAND_ALIAS = 'lg';

  COMMAND_DESCRIPTION = 'List of all the past function executed by the user on Etherless';

  exec(): Promise<any> {
    console.log(this.network.getlog().then((data: string[]) => { console.log(typeof data); }));
    return this.network.getlog().then((data: string[]) => { data.join('\n'); });
  }
}

export default LogCommand;
