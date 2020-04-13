# Etherless-cli

## Install all missing dependencies
``` npm install ```
2.3.1
Usage
Since etherless-cli is a command line application, you will make use of specific commands to
make use of its features. The commands syntax used is the following:
``` ts-node src/index.ts <command> [parameters...] ```
Attention! While performing this commands, your working directory needs to match the down-
loaded repo.
The following commands are currently available:
* login <privateKey> <password>
* logout
* signup <password>
* list
* create <functionName> <description> <prototype> <cost> <file> <password>
* run <functionName> <password> [parameters...]
* find <functionName>