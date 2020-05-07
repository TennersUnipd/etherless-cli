% Etherless(1) Version 0.15.20 | **etherless** client documentation

NAME
====

*etherless* - a program that lets you run cloud-stored applications from other users paying the execution in Ethereum.

DESCRIPTION
====

*etherless* is a cloud application platform which allows developers to deploy Javascript functions in the cloud and let pay the final user for the execution by leveraging the Ethereum's smart contract technology.

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
