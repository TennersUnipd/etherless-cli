import { Gateway } from '../gateway';

export function CMDList(gateway: Gateway, accountAddress: string) {
  console.log('Listing...');

  gateway.contract.methods.listFunctions().call({ from: accountAddress })
    .then((results: string[]) => {
      console.log(results.join('\n'));

      gateway.disconnect();
    }, (error: any) => {
      console.error('Something wrong happened');
      console.error(error);

      gateway.disconnect();
    });
}
