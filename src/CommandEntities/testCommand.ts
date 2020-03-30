import { Command } from './command';

class TestCommand extends Command {
    COMMAND_NAME = 'test';

    COMMAND_ALIAS = 't';

    COMMAND_DESCRIPTION = 'Dev test command';

    // eslint-disable-next-line class-methods-use-this
    exec(): Promise<any> {
      return new Promise<string>((resolve) => {
        resolve(this.network.session.getUserAddress());
      });
    }
}

export default TestCommand;
