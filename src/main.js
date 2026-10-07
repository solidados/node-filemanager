import { homedir } from 'node:os';
import { exit, stdin, stdout } from 'node:process'
import * as readline from "node:readline/promises";
import { PREFIX } from './constants/constants.js';
import {
  parseArgs,
  parseCommandArgs
} from "./utils/index.js";
import {
  handleAddCommand,
  handleCatCommand,
  handleCdCommand,
  handleCompressCommand,
  handleCpCommand,
  handleDecompressCommand,
  handleHashCommand,
  handleLsCommand,
  handleMkdirCommand,
  handleMvCommand,
  handleOsCommand,
  handleRmCommand,
  handleRnCommand,
  handleUpCommand
} from './commands/index.js'

let currentDirectory = homedir();
const username = parseArgs();

if (!username) {
  console.error('[Error]: Please specify username using --username=your_name');
  exit(1);
} else {
  console.log(`Welcome to the File Manager, ${username}!\nYou are currently in ${currentDirectory}`);
  start();
}

function start() {
  let isReadlineClosed = false;
  let isCommandRunning = false;
  let isExitRequested  = false;

  const rl = readline.createInterface({
    input: stdin,
    output: stdout,
  })

  rl.setPrompt(PREFIX);
  rl.prompt();

  rl.on('line', async (line) => {
    const input = line.trim();

    if (input === '.exit') {
      if (isCommandRunning) {
        isExitRequested = true;
      } else {
        rl.close();
        return;
      }
      return;
    }

    isCommandRunning = true;

    if (input === 'ls' || input.startsWith('ls ')) {
      const argsArr = input === 'ls' ? [] : parseCommandArgs(input, 3);
      currentDirectory = await handleLsCommand(argsArr, currentDirectory);
    } else if (input.startsWith('cd ')) {
      const argsArr = parseCommandArgs(input, 3);
      currentDirectory = await handleCdCommand(argsArr, currentDirectory);
    } else if (input === 'up' || input === '..') {
      currentDirectory = handleUpCommand(currentDirectory);
    } else if (input.startsWith('cat ')) {
      const argsArr = parseCommandArgs(input, 4);
      await handleCatCommand(argsArr, currentDirectory);
    } else if (input.startsWith('add ')) {
      const argsArr = parseCommandArgs(input, 4);
      await handleAddCommand(argsArr, currentDirectory);
    } else if (input.startsWith('mkdir ')) {
      const argsArr = parseCommandArgs(input, 6);
      await handleMkdirCommand(argsArr, currentDirectory);
    } else if (input.startsWith('rn ')) {
      const argsArr = parseCommandArgs(input, 3);
      await handleRnCommand(argsArr, currentDirectory);
    } else if (input.startsWith('cp ')) {
      const argsArr = parseCommandArgs(input, 3);
      await handleCpCommand(argsArr, currentDirectory);
    } else if (input.startsWith('mv ')) {
      const argsArr = parseCommandArgs(input, 3);
      await handleMvCommand(argsArr, currentDirectory);
    } else if (input.startsWith('rm ')) {
      const argsArr = parseCommandArgs(input, 3);
      await handleRmCommand(argsArr, currentDirectory);
    } else if (input.startsWith('os ')) {
      const argsArr = parseCommandArgs(input, 3);
      handleOsCommand(argsArr);
    } else if (input.startsWith('hash ')) {
      const argsArr = parseCommandArgs(input, 5);
      await handleHashCommand(argsArr, currentDirectory);
    } else if (input.startsWith('compress ')) {
      const argsArr = parseCommandArgs(input, 9);
      await handleCompressCommand(argsArr, currentDirectory);
    } else if (input.startsWith('decompress ')) {
      const argsArr = parseCommandArgs(input, 11);
      await handleDecompressCommand(argsArr, currentDirectory);
    } else {
      console.error('Invalid input');
    }

    isCommandRunning = false;

    console.log(`You are currently in ${currentDirectory}`)

    if (isExitRequested && !isReadlineClosed) {
      rl.close()
    } else if (!isReadlineClosed) {
      rl.prompt();
    }
  });

  rl.on('close', () => {
    isReadlineClosed = true;
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  })
}
