import Logger from '../log';
import Utils from '../utils';

import { Command, CommandInputs } from './command';

class RunCommand extends Command {
  COMMAND_NAME = 'run <functionName> <password> [parameters...]';

  COMMAND_ALIAS = 'r';

  COMMAND_DESCRIPTION = 'Request function execution';

  static RESP_AWAIT_TIMEOUT = 60; // seconds

  exec(inputs: RunCommandInputs): Promise<any> {
    let timerId;
    const runPromise = this.network.runFunction(inputs.name, inputs.parameters, inputs.password)
      .then((response) => {
        clearTimeout(timerId);
        let resparse;
        try {
          resparse = JSON.parse(response);
        } catch {
          throw new Error('Response not valide');
        }
        if (resparse.elemen.StatusCode !== 200) {
          throw new Error(resparse.elemen.message);
        }
        const logger: Logger = new Logger({
          fname: inputs.name,
          fdate: Date(),
          fcost: resparse.cost,
        });
        return resparse.elemen.Payload;
      });

    return Promise.race([
      runPromise,
      new Promise((reject) => {
        timerId = setTimeout(() => reject(new Error('Execution timeout')), RunCommand.RESP_AWAIT_TIMEOUT * 1000);
      }),
    ]);
  }

  // eslint-disable-next-line class-methods-use-this
  parseArgs(args: string[]): CommandInputs {
    const parameters = args.splice(2);
    const serialized = JSON.stringify(parameters[0]);
    return { name: args[0], password: args[1], parameters: serialized };
  }
}

interface RunCommandInputs extends CommandInputs {
  name: string;
  parameters: string;
  password: string;
}

export default RunCommand;
