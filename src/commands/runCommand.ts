import { Command, CommandInputs } from './command';
import Utils from '../utils';

class RunCommand extends Command {
    COMMAND_NAME = 'run <functionName> [parameters...]';

    COMMAND_ALIAS = 'r';

    COMMAND_DESCRIPTION = 'Request function execution';

    static RESP_AWAIT_TIMEOUT = 30; // seconds

    exec(inputs: RunCommandInputs): Promise<any> {
      return new Promise<any>((resolve, reject) => {
        const costFn = this.network.getContractMethods().costOfFunction(inputs.name);
        this.network.executeContractMethod(costFn)
          .then((cost: any) => {
            // TODO: cost has to be a number
            const serializedParams = JSON.stringify(inputs.parameters);
            const identifier = Utils.randomString();

            const execFn = this.network
              .getContractMethods()
              .execFunctionRequest(inputs.name, serializedParams, identifier);
            this.network.executeContractMethod(execFn, cost)
              .then(() => {
                this.awaitResponse(identifier, resolve, reject);
              })
              .catch(reject);
          }).catch(reject);
      });
    }

    // eslint-disable-next-line class-methods-use-this
    parseArgs(args: string[]): CommandInputs {
      return { name: args[0], parameters: args[1] };
    }

    awaitResponse(identifier: string, resolve: Function, reject: Function) {
      const subscription = this.network.getContract().once('RemoteResponse', { filter: { _identifier: identifier } }, (error:any, event:any) => {
        if (error == null) {
          resolve(JSON.parse(event.returnValues.response));
        } else {
          reject(error);
        }
      });

      setTimeout(() => {
        // subscription.unsubscribe();
      }, RunCommand.RESP_AWAIT_TIMEOUT * 1000);
    }
}

interface RunCommandInputs extends CommandInputs {
    name: string;
    parameters: string[];
}

export default RunCommand;
