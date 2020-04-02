import { Contract } from 'web3-eth-contract';

import { AbiItem, AbiInput } from 'web3-utils';

import Web3 from 'web3';
import { ContractInterface, Inputs } from './contractInterface';

import BN = require('bn.js');

type fCall = (args:any[]) => any;

class EtherlessContract extends ContractInterface {
  private readonly GASBASE = 1000000

  private contract: Contract;

  private web3: Web3;

  /**
   * @param commandList contains all the function exposed by the contract
   */
  private commandList: Map<string, [AbiItem, Inputs[]]>;

  private commandLoader: Map<string, fCall>

  /**
   *
   * @param ABI
   * @param conctractAddress
   * @param provider
   */
  constructor(ABI:AbiItem[], conctractAddress:string, provider:any) {
    super();
    this.web3 = provider;
    this.commandList = new Map<string, [AbiItem, Inputs[]]>();
    this.commandLoader = new Map<string, fCall>();
    if (this.web3.eth != null) {
      this.contract = new this.web3.eth.Contract(ABI, conctractAddress);
    } else console.log('not ok');
    this.setUpMap();
  }

  /**
   *
   * @param userAddress
   * @param requested
   * @param args
   */
  public async estimateGasCost(userAddress: string, requested: string, args:any[]):
   Promise<number> {
    this.argumentCheck(requested, args);
    const gasCost = await this.commandLoader.get(requested)(args).estimateGas({ from: userAddress });
    return gasCost;
  }

  /**
   *
   * @param signal
   * @param id
   */
  public getSignal(signal: string, id: string): any {
    this.contract.once(signal, { filter: { _identifier: id } }, (err:any, event:any) => {
      if (event.id === id) {
        if (err !== null) {
          throw new Error(`could not get the signal requested error: ${err}`);
        }
        return JSON.parse(event.returnValues[0]);
      }
    });
  }

  /**
   *
   */
  public getListOfFunctions(): string[] {
    return Array.from(this.commandList.keys());
  }

  public getCallable(requested: string, arg: any[]) {
    return this.commandLoader.get(requested)(arg);
  }

  /**
   *
   * @param requested
   */
  public isTheFunctionPayable(requested: string): boolean {
    if (this.commandList.get(requested)[0].stateMutability !== 'payable') {
      return false;
    }
    return true;
  }

  /**
   *
   */
  public getArgumentsOfFunction(requested:string):Inputs[] {
    return this.commandList.get(requested)[1];
  }

  /**
   *
   */
  public async getLog(userAddress:string): Promise<string[]> {
    let toBeReturned:string[];
    // filter may be wrong
    const pastEvents = await this.contract.getPastEvents('allEvents',
      { filter: { address: userAddress }, fromBlock: 0, toBlock: 'latest' });
    pastEvents.forEach((element) => {
      toBeReturned.push(`${element.logIndex}: ${element.event} ${element.address}`);
    });
    return toBeReturned;
  }

  /**
   *
   * @param userAddress
   * @param requested
   * @param args
   */
  public getFunctionTransaction(userAddress:string, requested: string, args: any[])
    : Promise<object> {
    if (!this.commandList.has(requested)) {
      throw new Error('Function not found');
    }
    this.argumentCheck(requested, args);
    return this.prepareTransaction(userAddress, requested, args);
  }

  /**
   *
   */
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

    this.commandLoader.set('createFunction', (args:any[]):any => this.contract.methods.createFunction(args[0], args[1], args[2], args[3], args[4]));
    this.commandLoader.set('listFunctions', (args:any[]):any => this.contract.methods.listFunctions());
    this.commandLoader.set('runFunction', (args:any[]):any => this.contract.methods.runFunction(args[0], args[1], args[2]));
  }

  /**
   *
   */
  private async prepareTransaction(userAddress:string, requested:string, args: any[])
    :Promise<object> {
    return {
      once: await this.web3.eth.getTransactionCount(userAddress),
      from: userAddress,
      to: this.contract.options.address,
      gas: Web3.utils.toHex(new BN((await this.estimateGasCost(userAddress, requested, args)) * 1.5)),
      data: this.commandLoader.get(requested)(args).encodeABI(),
    };
  }

  /**
   *
   * @param requested
   * @param args
   */
  private argumentCheck(requested: string, args: any[]):boolean {
    const inputs = this.getArgumentsOfFunction(requested);
    if (args.length !== inputs.length) {
      throw new Error(`Aspected ${inputs.length} arguments found ${args.length}`);
    }
    for (let i = 0; i < inputs.length; i += 1) {
      // eslint-disable-next-line valid-typeof
      if (typeof args[i] !== inputs[i].type) {
        if (inputs[i].type === 'unint256' && typeof args[i] !== 'number') {
          throw new Error(`expected ${inputs[i].type} on argument ${i}`);
        }
      }
    }
    return true;
  }

  /**
   *
   */
  private getTypesString(requested:string):string {
    const types = this.getArgumentsOfFunction(requested);
    let toBeReturned:string = '(';
    types.forEach((type, index) => {
      if (index === types.length - 1) {
        toBeReturned = toBeReturned.concat(`${type.internalType}`);
      } else {
        toBeReturned = toBeReturned.concat(`${type.internalType},`);
      }
    });
    toBeReturned = toBeReturned.concat(')');
    return toBeReturned;
  }

  /**
   *
   * @param args
   */
  private static prepareArgs(args:any[]):string {
    let stringArgs = JSON.stringify(args);
    stringArgs = stringArgs.substr(1, stringArgs.length - 2);
    return stringArgs;
  }
}

export default EtherlessContract;
