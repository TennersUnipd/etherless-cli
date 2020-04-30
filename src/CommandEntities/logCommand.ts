import { Command } from './command';
import { rejects } from 'assert';
var fs = require('fs');

class LogCommand extends Command {
    COMMAND_NAME = 'log';

    COMMAND_ALIAS = 'll';

    COMMAND_DESCRIPTION = 'list of the latest 20 functions run logged';

    exec(): Promise<any> {    
      return new Promise((resolve, rejects) => {
          try{
            resolve(JSON.parse(fs.readFileSync('logs.json', 'utf-8')));           
          }
          catch(error){
              if(error.code === 'ENOENT') {
                rejects("No functions run and no log generated");
              } else {
                  rejects("generic error");
              }
          }          
        }
      );
    }
}

export default LogCommand;
