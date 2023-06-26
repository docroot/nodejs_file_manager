import os from 'os';
import path from 'path';

import { cmd_exit } from "./commands/exit.js";
import { cmd_up } from "./commands/up.js";

const sigint = process.platform === 'win32' ? 'SIGBREAK' : 'SIGINT';

const invInputStr = 'Invalid input';

const commands = {
    '.exit': { 'cmd': 'cmd_exit', 'min_args': 0 },
    'up': { 'cmd': 'cmd_up', 'min_args': 0 },
};


const printPromt = (ctx) => {
    process.stdout.write(`You are currently in ${ctx['cwd']}\n`);
    process.stdout.write(`Input a command $ `);
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
const username = getUsernameFromArgs();


const context = {
    'cwd': homedir,
    'homedir': homedir,
    'username': username,
    'rootDir': rootDir,
    'pathDelimiter': pathDelimiter,
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


const processUserInput = (chunk) => {
    const cmdString = chunk.toString().replace(/[\r\n]+$/g, '').replace(/^\s+/, '').replace(/\s+$/, '');
    if (cmdString.length === 0) return;
    try {
        const args = parseCommand(cmdString);
        if (args.length === 0 || args[0].length === 0) throw new Error();

        let cmd = args[0];
        // console.debug('command: [' + cmd + ']');

        if (!commands.hasOwnProperty(cmd)) throw new Error();

        if (commands[cmd]['min_args'] > args.length - 1) throw new Error();

        eval(commands[cmd]['cmd'])(context, args.slice(1));
    } catch (error) {
        // console.log(error);
        console.log(invInputStr);
    }
    printPromt(context);
};


process.chdir(homedir);
console.log(`Welcome to the File Manager, ${username}!`);
printPromt(context);

process.on('exit', (code) => {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
});

process.on('SIGINT', () => {
    console.log('');
    process.exit(0);
});

process.stdin.on('data', processUserInput);

