import { Command, CommandInputs } from './command';

class FindCommand extends Command {
    COMMAND_NAME = 'find <functionName>';

    COMMAND_ALIAS = 'f';

    COMMAND_DESCRIPTION = 'Describe details of a function available on Etherless';

    exec(inputs: FindCommandInputs): Promise<any> {
      const contractFn = this.network.getContractMethods().findFunctions(inputs.name);
      return this.network.callContractMethod(contractFn).then((result)=>{
          const output= 'Costo: ' + result.cost + 
          '\nOwner: ' + result.owner +
          '\nPrototype: '+ result.prototype;
          return output;
      }).catch(()=>{return "Funzione non trovata";});
    }

    parseArgs(args: string[]): FindCommandInputs {
        return { name: args[0]};
      }
}

interface FindCommandInputs extends CommandInputs {
    name: string;
}

export default FindCommand;
