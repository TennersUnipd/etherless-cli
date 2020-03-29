import { Contract } from 'web3-eth-contract';
import { AbiItem, AbiInput } from 'web3-utils';
import Web3 from 'web3';
import { strict } from 'assert';
import { ContractInterface, Inputs } from './contractInterface';

class EtherlessContract extends ContractInterface {
  private readonly GASBASE = 1000000

  private contract: Contract;

  /**
   * @param commandList contains all the function exposed by the contract
   */
  private commandList: Map<string, [AbiItem, Inputs[]]>;

  constructor(ABI:AbiItem[], conctractAddress:string, provider:string | any) {
    super(ABI, conctractAddress, provider);
    const webinstance = new Web3(provider);
    this.commandList = new Map<string, [AbiItem, Inputs[]]>();
    this.contract = new webinstance.eth.Contract(ABI, conctractAddress);
    this.setUpMap();
  }

  async estimateGasCost(userAddress: string, requested: string, args:any[]): Promise<number> {
    const finalString = requested.concat(this.getTypesString(requested));
    this.argumentCheck(requested, args);
    const estimatedCost = await this.contract
      .methods[finalString](eval(EtherlessContract.prepareArgs(args))) // TODO: BAD SOLUTION NEEDS DISCUSSION!!!
      .estimateGas({ from: userAddress, gas: this.GASBASE });
    return estimatedCost;
  }

  getListOfFunctions(): string[] {
    return Array.from(this.commandList.keys());
  }

  isTheFunctionPayable(requested: string): boolean {
    if (this.commandList.get(requested)[0].stateMutability !== 'payable') {
      return false;
    }
    return true;
  }

  getArgumentsOfFunction(requested:string):Inputs[] {
    return this.commandList.get(requested)[1];
  }

  async getLog(address:string): Promise<string[]> {
    let toBeReturned:string[];
    const pastEvents = await this.contract.getPastEvents('allEvents');// to be fixed
    pastEvents.forEach((element) => {
      toBeReturned.push(`${element.logIndex}: ${element.event} ${element.address}`);
    });
    return toBeReturned;
  }

  getFunctionTransaction(userAddress:string, requested: string, args: any[])
    : Promise<object> {
    if (!this.commandList.has(requested)) {
      throw new Error('Function not found');
    }
    this.argumentCheck(requested, args);
    return this.prepareTransaction(userAddress, requested, args);
  }

  private setUpMap():void {
    this.contract.options.jsonInterface.forEach((element:AbiItem) => {
      if (element.type === 'function' && element.name !== '') {
        const argumentsCollector: Inputs[] = [];
        element.inputs.forEach((argm: AbiInput) => {
          argumentsCollector
            .push({ internalType: argm.internalType, name: argm.name, type: argm.type });
        });
        this.commandList.set(element.name, [element, argumentsCollector]);
      }
    });
  }

  private async prepareTransaction(userAddress:string, requested:string, args: any[])
    :Promise<object> {
    const toBeReturned = {
      from: userAddress,
      to: this.contract.options.address,
      gas: (await this.estimateGasCost(userAddress, requested, args)) * 1.5,
      data: this.contract.methods[requested](eval(EtherlessContract.prepareArgs(args))).encodeABI(),
    };
    return toBeReturned;
  }

  private argumentCheck(requested: string, args: any[]):boolean {
    const inputs = this.getArgumentsOfFunction(requested);
    if (args.length !== inputs.length) {
      throw new Error(`Aspected ${inputs.length} arguments found ${args.length}`);
    }
    for (let i = 0; i < inputs.length; i += 1) {
      // eslint-disable-next-line valid-typeof
      if (typeof args[i] !== inputs[i].type) {
        throw new Error(`expected ${inputs[i].type} on argument ${i}`);
      }
    }
    return true;
  }

  private getTypesString(requested:string):string {
    const types = this.getArgumentsOfFunction(requested);
    let toBeReturned:string = '(';
    types.forEach((type) => {
      toBeReturned = toBeReturned.concat(`${type.internalType},`);
    });
    toBeReturned = toBeReturned.substring(0, toBeReturned.length - 1);
    toBeReturned = toBeReturned.concat(')');
    return toBeReturned;
  }

  private static prepareArgs(args:any[]):string {
    let stringArgs = JSON.stringify(args);
    stringArgs = stringArgs.substr(1, stringArgs.length - 2);
    return stringArgs;
  }
}

export default EtherlessContract;
