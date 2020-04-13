import { Gateway } from '../gateway';
import { Utils } from '../utils';

export function CMDRun(gateway: Gateway, accountAddress: string, params: RunFNData) {
  console.log('About to request function execution...');

  // get cost of function
  gateway.contract.methods.costOfFunction(params.name)
    .call({ from: accountAddress })
    .then((cost: number) => {
      console.log(`Cost of function is ${cost}`);

      // TODO: move stringify in a Utils module
      const serializedParams = JSON.stringify(params.parameters);
      const identifier = Utils.randomIdentifier();
      console.log('params sent: ', serializedParams);
      gateway.contract.methods.execFunctionRequest(params.name, serializedParams, identifier)
        .send({ from: accountAddress, value: cost })
        .then((result: any) => {
          console.log('Execution requested successfully');
          // now start listening for response
          awaitResponse(gateway, identifier);
        }, (error: any) => {
          console.error('Something wrong happened');
          console.debug(error);
          gateway.disconnect();
        });
    }, (error: any) => {
      console.error('Something wrong happened');
      console.debug(error);
      gateway.disconnect();
    });
}

function awaitResponse(gateway: Gateway, identifier: string) {
  // TODO: add timeout
  gateway.contract.once('RemoteResponse', { filter: { _identifier: identifier } }, (error:any, event:any) => {
    if (event.id == '34') {

      // è il mio fe
    }
    if (error == null) {
      // TODO: check parsing proces
      console.log('Response received', JSON.parse(event.returnValues[0])); // TODO: optimize indexing with event param names (no 0,1...)
    } else {
      console.error('Unable to retrieve response', error);
    }
    gateway.disconnect();
  });
}

export interface RunFNData {
    name: string;
    parameters: string[];
}
