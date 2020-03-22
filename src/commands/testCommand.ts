import { Command, CommandInputs } from './command';
import SessionManager from '../sessionManager';

class TestCommand extends Command {
    COMMAND_NAME = 'test';

    COMMAND_ALIAS = 't';

    COMMAND_DESCRIPTION = 'Dev test command';

    // eslint-disable-next-line class-methods-use-this
    exec(): Promise<any> {
      return new Promise<boolean>((resolve) => {
        resolve(SessionManager.getInstance().userLogged());
      });
    }
}

export default TestCommand;
