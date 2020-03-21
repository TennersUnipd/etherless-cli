#!/usr/bin/env node

import Commander from './src/commander';
import ListCommand from './src/commands/listCommand';
import Network from './src/network';
import { RunCommand } from './src/commands/runCommand';

const network = new Network();

Commander.config();
Commander.addCommand(new RunCommand(network));
Commander.start();
