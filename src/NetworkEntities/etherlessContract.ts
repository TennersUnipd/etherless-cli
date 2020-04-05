import { Contract } from 'web3-eth-contract';

import { AbiItem, AbiInput } from 'web3-utils';

import Web3 from 'web3';
import { ContractInterface, Inputs } from './contractInterface';

import BN = require('bn.js');

type fCall = (args:any[]) => any;

class EtherlessContract extends ContractInterface {
  private readonly GASBASE = 1000000

  public contract: Contract;

  private web3: Web3;

  /**
   * @param commandList contains all the function exposed by the contract
   */
  private commandList: Map<string, [AbiItem, Inputs[]]>;

  private commandLoader: Map<string, fCall>

  /**
   *
   * @param ABI
   * @param contractAddress
   * @param provider
   */
  constructor(ABI:AbiItem[], contractAddress:string, provider:any) {
    super();
    this.web3 = provider;
    this.commandList = new Map<string, [AbiItem, Inputs[]]>();
    this.commandLoader = new Map<string, fCall>();
    this.contract = new this.web3.eth.Contract(ABI, contractAddress);
    this.setUpMap();
  }

  /**
   *
   * @param userAddress
   * @param requested
   * @param args
   */
  public async estimateGasCost(userAddress: string, requested: string, args:any[], value: number = undefined):
   Promise<number> {
    // TODO: non si puo fare su argument check su una funzione che fa tutt'altro
    // this.argumentCheck(requested, args);
    const gasCost = await this.commandLoader.get(requested)(args).estimateGas({ from: userAddress, value });
    return gasCost;
  }

  /**
   *
   * @param signal
   * @param id
   */
  public getSignal(signal: string, id: string): Promise<any> {
    return new Promise<string>((resolve, reject) => {
      this.contract.once(signal, { filter: { _identifier: id } }, (err:any, event:any) => {
        if (err !== null) {
          reject(new Error(`Could not get the signal requested error: ${err}`));
        }
        // eslint-disable-next-line no-underscore-dangle
        resolve(JSON.parse(event.returnValues._response));
      });
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
    let command: any;
    try {
      // eslint-disable-next-line prefer-destructuring
      command = this.commandList.get(requested)[0];
    } catch {
      throw new Error(`Function ${requested} not available`);
    }
    if (command.stateMutability !== 'payable') {
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
  public getFunctionTransaction(userAddress:string, requested: string, args: any[], gasEstimate: number, value: number = undefined)
    : Promise<object> {
    if (!this.commandList.has(requested)) {
      throw new Error('Function not found');
    }
    this.argumentCheck(requested, args);
    return this.prepareTransaction(userAddress, requested, args, gasEstimate, value);
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
    this.commandLoader.set('listFunctions', ():any => this.contract.methods.listFunctions());
    this.commandLoader.set('costOfFunction', (args:any[]):any => this.contract.methods.costOfFunction(args[0]));
    this.commandLoader.set('findFunction', (args:any[]):any => this.contract.methods.findFunction(args[0]));
    this.commandLoader.set('runFunction', (args:any[]):any => this.contract.methods.runFunction(args[0], args[1], args[2]));
  }

  /**
   *
   */
  private async prepareTransaction(
    userAddress:string,
    requested:string,
    args: any[],
    gasEstimate: number,
    value: number = undefined,
  ) :Promise<object> {
    return {
      // once: await this.web3.eth.getTransactionCount(userAddress),
      from: userAddress,
      to: this.contract.options.address,
      gas: gasEstimate * 2,
      data: this.commandLoader.get(requested)(args).encodeABI(),
      value,
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
      throw new Error(`expected ${inputs.length} arguments found ${args.length}`);
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
}

export default EtherlessContract;
