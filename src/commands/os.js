import os from 'os';

const cmd_os = async (ctx, args) => {
    if (args.length !== 1) throw new Error();

    const re = /^--.+/;
    if (!re.test(args[0])) throw new Error();

    const opt = args[0].substring(2);

    switch (opt) {
        case 'EOL':
            const eol = JSON.stringify(os.EOL);
            console.log(`Default system End-Of-Line is \x1b[1m\x1b[32m${eol}\x1b[0m`);
            break;
        case 'cpus':
            const cpus = os.cpus();
            console.log(`Number of CPUs is [\x1b[1m\x1b[32m${cpus.length}\x1b[0m]`);
            const cpuInfo = [];
            cpus.forEach(cpu => {
                cpuInfo.push({ 'Model': cpu.model, 'Clock rate (GHz)': (cpu.speed / 1000).toFixed(2) });
            });
            console.table(cpuInfo);
            break;
        case 'homedir':
            console.log(`The HOMEDIR is [\x1b[1m\x1b[32m${ctx.homedir}\x1b[0m]`);
            break;
        case 'username':
            const username = os.userInfo().username;
            console.log(`The USERNAME is [\x1b[1m\x1b[32m${username}\x1b[0m]`);
            break;
        case 'architecture':
            console.log(`The ARCHITECTURE is [\x1b[1m\x1b[32m${process.arch}\x1b[0m]`);
            break;

        default:
            throw new Error();
    }
}

export {
    cmd_os
}
