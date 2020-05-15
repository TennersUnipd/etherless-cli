% Etherless(1) Version 4.0.0 | **etherless** client documentation

NAME
====

*etherless* - a program that lets you run cloud-stored applications from other users paying the execution in Ethereum.

DESCRIPTION
====

*etherless* is a cloud application platform which allows developers to deploy Javascript functions in the cloud and let pay the final user for the execution by leveraging the Ethereum's smart contract technology.

INSTALLATION
====

1. Download the installation package from: https://github.com/TennersUnipd/etherless-cli/releases
2. Open a terminal and move the working directory to the enclosing folder of the downloaded.tgz file
3. Install the package through the npm package manager: npm install etherless-cli.tgz -g

SYNOPSIS
====
 **etherless** \[command] \[arguments...]

COMMAND
====

**signup**, **su** \<password>
: Creates a new account and logs the user in

**login**, **lg** \<0xprivateKey> \<password>
: Logs the user in with an existing account  

**logout**, **lo**
: Delete the local credentials

**list**, **l**
: Lists all the function loaded on the serivice

**create**, **c** \<name> \<description> \<prototype> \<cost> \<file> \<password>
: Create a new function entry on the service

**delete**, **d**
: Deletes the selected function if the user has the rights

**find**, **f** \<function>
: Returns detals of the selected function

**log**, **ll**
: Returns the last 20 past run execution

**run**, **r** \<functionName> \<password> \<parameters...>
: Request the result of the run of a remote function

**set**, **s** \<functionName> \<property> \<value> \<password>
: Sets a property on a function

**update**, **u** \<function> \<file>
: Updates the file function
