import SessionManager from './sessionManager';
import Utils from './utils';

const axios = require('axios');

class Network {
    contract: object = {};

    awsEndpoint: string = 'fdsfsd';

    private sessionManager = SessionManager.getInstance();

    getContract(): any {
      return this.contract;
    }

    getContractMethods(): any {
      return this.contract;
    }

    executeContractMethod(func: any, cost: number = 0): Promise<string[]> {
      if (this.sessionManager.userLogged() === false) {
        throw new Error('No user logged');
      }

      return func.call({ from: this.sessionManager.user?.accountAddress, value: cost });
    }

    uploadFunction(fileBuffer: string): Promise<any> {
      if (this.sessionManager.userLogged() === false) {
        throw new Error('No user logged');
      }

      return axios.post(`${this.awsEndpoint}createFunction`,
        {
          zip: fileBuffer,
          name: Utils.randomString(),
        });
    }
}

export default Network;
