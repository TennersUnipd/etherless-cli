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

**delete**, **d** \<function>
: Deletes the selected function if the user has the rights

**find**, **f** \<function>
: Returns details of the selected function

**log**, **ll**
: Returns the last 20 past run execution

**run**, **r** \<functionName> \<password> \<parameters...>
: Request the result of the run of a remote function

**set**, **s** \<functionName> \<property> \<value> \<password>
: Sets a property on a function

**update**, **u** \<function> \<file>
: Updates the file function


EXAMPLES
====

**etherless** *signup* \<yourSecretPassword>
: The system proceeds to register a brand new account and then displays the following values: 
: An **address** identifying the *Ethereum* account
: A **private-key** associated with the *Ethereum* account

**etherless** *login* \<0xprivateKey> \<yourSecretPassword>
: This command logs the user in with an existing account 

**etherless** *logout*
: This command will remove all session data and encrypted stored credentials.

**etherless** *list*
: This command will show you a list of all functions that have been uploaded to Etherless

**etherless** *create* \<functionName> \<functionDescription> \<functionProperty> \<functionCost> \<path/to/your/function.js> \<yourSecretPassword>
: This command is used to create a remote function 

**etherless** *delete* \<functionName>
: This command is used to delete only your own functions

**etherless** *find* \<functionName>
: This command returns informations of the selected function

**etherless** *log*
: This command shows a list of all execution requests a user has taken in the past on his machine

**etherless** *run* \<functionName> \<yourSecretPassword> \<yourParameters...>
: This command is used to request execution of a remote function

**etherless** *set* \<functionName> \<functionProperty> \<functionValue> \<yourSecretPassword>
: This command is used to update a function property.

**etherless** *update* \<functionName> \<path/to/your/function.js>
: This command updates the code of your already existing function