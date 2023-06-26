import os from 'os';
import path from 'path';
import readline from 'readline/promises';

import { cmd_exit } from "./commands/exit.js";
import { cmd_up } from "./commands/up.js";
import { cmd_cd } from "./commands/cd.js";
import { cmd_ls } from "./commands/ls.js";
import { cmd_cat } from "./commands/cat.js";
import { cmd_add } from "./commands/add.js";
import { cmd_rn } from "./commands/rn.js";
import { cmd_cp } from "./commands/cp.js";
import { cmd_rm } from "./commands/rm.js";
import { cmd_mv } from "./commands/mv.js";
import { cmd_os } from "./commands/os.js";
import { cmd_hash } from "./commands/hash.js";


const sigint = process.platform === 'win32' ? 'SIGBREAK' : 'SIGINT';

const invInputStr = '\x1b[1m\x1b[33mInvalid input\x1b[0m';
const operationFailed = '\x1b[1m\x1b[31mOperation failed\x1b[0m';

const commands = {
    '.exit': { 'cmd': 'cmd_exit', 'min_args': 0 },
    'up': { 'cmd': 'cmd_up', 'min_args': 0 },
    'cd': { 'cmd': 'cmd_cd', 'min_args': 1 },
    'ls': { 'cmd': 'cmd_ls', 'min_args': 0 },
    'cat': { 'cmd': 'cmd_cat', 'min_args': 1 },
    'add': { 'cmd': 'cmd_add', 'min_args': 1 },
    'rn': { 'cmd': 'cmd_rn', 'min_args': 2 },
    'cp': { 'cmd': 'cmd_cp', 'min_args': 2 },
    'mv': { 'cmd': 'cmd_mv', 'min_args': 1 },
    'os': { 'cmd': 'cmd_os', 'min_args': 1 },
    'hash': { 'cmd': 'cmd_hash', 'min_args': 1 },
};


const printPromt = (ctx) => {
    process.stdout.write(`\x1b[37mYou are currently in \x1b[1m${ctx['cwd']}\x1b[0m\n`);
}


const getUsernameFromArgs = () => {
    const re = /^--username=.+/;
    const args = process.argv;
    for (let i = 0; i < args.length; i++) {
        if (re.test(args[i])) {
            return args[i].split(/=/)[1];
        }
    }
    return 'Anonymous';
};


const homedir = os.homedir();
const rootDir = path.parse(process.cwd()).root;
const pathDelimiter = path.delimiter;
const dirSeparator = path.sep;
const username = getUsernameFromArgs();

const context = {
    'cwd': homedir,
    'homedir': homedir,
    'username': username,
    'rootDir': rootDir,
    'pathDelimiter': pathDelimiter,
    'dirSeparator': dirSeparator,
}


const parseCommand = (command) => {
    const args = [];
    let curArg = '';
    let i = 0;
    let p = '';
    let s = '';
    while (i < command.length) {
        const char = command[i];
        if (s == "'") {
            if (char !== "'") {
                curArg = curArg + char;
            }
            else {
                if (curArg.length > 0) args.push(curArg);
                curArg = '';
                s = '';
            }
        }
        else if (char !== ' ') {
            if (char === "'" && (p === '' || p === ' ')) {
                s = char;
            }
            else {
                curArg = curArg + char;
            }
        }
        else {
            if (curArg.length > 0) args.push(curArg);
            curArg = '';
            s = '';
        }
        p = char;
        i++;
        continue;
    }
    if (curArg.length > 0) {
        if (s != "'") {
            args.push(curArg);
        }
        else {
            throw new Error(invInputStr);
        }
    }
    return args;
}

const execCmd = async (cmd, context, args) => {
    const cmdFunc = eval(cmd);
    await cmdFunc(context, args);
}

const processUserInput = async (chunk) => {
    const cmdString = chunk.toString().replace(/[\r\n]+$/g, '').replace(/^\s+/, '').replace(/\s+$/, '');
    if (cmdString.length === 0) return;
    try {
        const args = parseCommand(cmdString);
        if (args.length === 0 || args[0].length === 0) throw new Error();

        let cmd = args[0];
        // console.debug('command: [' + cmd + ']');

        if (!commands.hasOwnProperty(cmd)) throw new Error();

        if (commands[cmd]['min_args'] > args.length - 1) throw new Error();

        try {
            await execCmd(commands[cmd]['cmd'], context, args.slice(1));
        } catch (error) {
            // console.log(error);
            console.log(operationFailed);
        }
    } catch (error) {
        console.log(invInputStr);
    }
    printPromt(context);
};


process.chdir(homedir);
console.log(`Welcome to the File Manager, ${username}!`);
printPromt(context);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

process.on('exit', (code) => {
    console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
    rl.close();
});

// process.on('SIGINT', () => {
//     console.log('\n');
//     process.exit(0);
// });


do {
    const answer = await rl.question('Input a command > ');
    await processUserInput(answer);
} while (1);

