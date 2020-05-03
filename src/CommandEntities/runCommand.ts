import { Command, CommandInputs, ExecutionResponse } from './command';
import Utils from '../utils';

class RunCommand extends Command {
  COMMAND_NAME = 'run <functionName> <password> [parameters...]';

  COMMAND_ALIAS = 'r';

  COMMAND_DESCRIPTION = 'Request function execution';

  static RESP_AWAIT_TIMEOUT = 30; // seconds

  exec(inputs: RunCommandInputs): Promise<ExecutionResponse | string> {
    return this.network.runFunction(inputs.name, inputs.parameters, inputs.password)
      .then((response) => {
        const resparse = JSON.parse(response);
        if (resparse.elemen.StatusCode !== 200) {
          return 'Something went wrong with the remote function!';
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

export default RunCommand;
