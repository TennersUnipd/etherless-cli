import { Contract, EventData } from 'web3-eth-contract';

import { AbiItem, AbiInput } from 'web3-utils';
import { Log } from 'web3-core';


import Web3 from 'web3';
import { ContractInterface, Inputs } from './contractInterface';


type fCall = (args: any[]) => any;

class EtherlessContract extends ContractInterface {

  private readonly GASBASE = 1000000;

  private contract: Contract;

  private web3: Web3;

  private address: string;

  private commandList: AbiItem[];

  /**
   *
   * @param ABI
   * @param contractAddress
   * @param provider
   */
  constructor(ABI: AbiItem[], contractAddress: string, provider: any) {
    super();
    this.web3 = provider;
    this.commandList = ABI;
    this.contract = new this.web3.eth.Contract(ABI, contractAddress);
    this.address = contractAddress;
  }

  /**
   *
   * @param userAddress
   * @param requested
   * @param args
   */
  public async estimateGasCost(userAddress: string, requested: string, args: string[],
    _value: number = undefined): Promise<number> {
    const fEncoded = this.getAbiEncode(requested, args);
    const gasCost = await this.web3.eth
      .estimateGas({
        gas: this.web3.utils.toHex(this.GASBASE),
        to: this.address,
        from: userAddress,
        data: fEncoded,
        value: _value,
      });
    return gasCost;
  }

  public decodeResponse(requested: string, encodedResult: any): any {
    const out = this.commandList.filter((ele) => ele.name === requested)[0].outputs
    return this.web3.eth.abi.decodeParameters(out, encodedResult)[0];
  }

  private getAbiEncode(requested: string, args: string[]): string {
    return this.web3.eth.abi
      .encodeFunctionCall(this.commandList
        .filter((element: AbiItem) => element.name === requested)[0], args);
  }

  /**
   *
   * @param signal
   * @param id
   */
  public getSignal(signal: string, id: string): Promise<any> {
    return new Promise<string>((resolve, reject) => {
      this.contract.once(signal, { filter: { _identifier: id } }, (err: any, event: any) => {
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
  // eslint-disable-next-line class-methods-use-this
  public getListOfFunctions(): string[] {
    const toReturn: string[] = [];
    this.commandList.filter((elem) => {
      if (!elem.name.includes('(')) {
        toReturn.push(elem.name);
        return true;
      }
      return false;
    });
    return toReturn;
  }

  public getCallable(userAddress: string, requested: string, arg?: any[]): any {
    return this.prepareTransaction(userAddress, requested, arg);
  }

  /**
   *
   * @param requested
   */
  public isTheFunctionPayable(requested: string): boolean {
    const item: AbiItem[] = this.commandList.filter((ele) => ele.name === requested);
    if (item[0] === undefined) throw new Error('the called function is missing');
    if (item[0].payable) return true;
    return false;
  }

  public getArgumentsOfFunction(requested: string): Inputs[] {
    console.log(this.commandList.filter((ele) => ele.name === requested)[0].inputs);
    return [{ internalType: 'test', name: 'test', type: 'test' }];
  }

  /**
   *
   */
  public async getLog(userAddress: string): Promise<string[]> {
    let gasG = await this.web3.eth.getTransactionCount(userAddress);
    return new Promise((resolve, reject) => {
      this.web3.eth.getTransactionCount(userAddress)
        .then((value) => {
          console.log(value);
          resolve([value.toString()]);
        })
        .catch((err) => { reject(err); });
    });
  }

  /**
   *
   * @param userAddress
   * @param requested
   * @param args
   */
  public async getFunctionTransaction(userAddress: string, requested: string,
    args: any[], value: number = undefined): Promise<object> {
    if (this.commandList.find((fn) => fn.name === requested) === undefined) {
      throw new Error('Function not found');
    }
    return this.prepareTransaction(userAddress, requested, args, value);
  }

  /**
   *
   */
  private async prepareTransaction(userAddress: string, requested: string, args: any[],
    value: number = undefined): Promise<object> {
    const gasEstimate = await this.estimateGasCost(userAddress, requested, args, value);
    return {
      from: userAddress,
      to: this.contract.options.address,
      gas: gasEstimate * 2,
      data: this.getAbiEncode(requested, args),
      value,
    };
  }
}

export default EtherlessContract;
