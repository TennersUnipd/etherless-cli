# Etherless-cli

This is the CLI component of the Etherless project that you can find [here](https://github.com/TennersUnipd/etherless)

## Requirements
To make it work you need to install:
- [Nodejs-lts](https://nodejs.org/it/download/) (12.16.1 as today).
- Typescritp  ``` npm install -g trypesctipt@3.6 ```
- ts-node  ``` npm install -g ts-node ```

## How to run it 

**This component cannot work alone, you need the other component of the project Etherless.**

After cloning this repository you need to install the dependencies ``` npm install --dotenv-extended```

done that you need to copy the abi file that you can find in the folder build/contracts after the command ``` truffle build ``` in contracts folder of this component.
Before running the program, you must substitute the test account and the contract address in the configurator.
At the time of writing the commands implemented are list, run and add. You can run them using the command ts-node. <"command">
