/**
 * @file runCommand.ts
 * @class RunCommand
 * @package CommandEntities
 */
import { Command, CommandInputs } from './command';

/**
 * @class
 * @extends Command
 * extends the class command and implement the run command
 */
export default class RunCommand extends Command {
  COMMAND_NAME = 'run <functionName> <password> [parameters...]';

  COMMAND_ALIAS = 'r';

  COMMAND_DESCRIPTION = 'Request function execution';

  static RESP_AWAIT_TIMEOUT = 60; // seconds

  exec(inputs: RunCommandInputs): Promise<any> {
    return this.network.runFunction(inputs.name, inputs.parameters, inputs.password)
      .then((response) => {
        let resparse;
        try {
          resparse = JSON.parse(response);
        } catch {
          throw new Error('Response not valide');
        }
        if (resparse.elemen.StatusCode !== 200) {
          throw new Error(resparse.elemen.message);
        }
        return {
          response: resparse.elemen.Payload as string,
          logData: {
            fname: inputs.name,
            fdate: new Date(),
            fcost: resparse.cost,
          },
        };
      });
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
