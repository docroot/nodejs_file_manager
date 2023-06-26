import fs from 'fs';
import fsP from 'fs/promises';
import path from 'path';

const cmd_cp = async (ctx, args) => {
    if (args.length !== 2) throw new Error();
    let filePaths = [];
    const fileName = path.basename(args[0]);

    if (path.isAbsolute(args[0])) {
        filePaths.push(args[0]);
    }
    else {
        filePaths.push(path.join(ctx.cwd, args[0]));
    }

    if (path.isAbsolute(args[1])) {
        filePaths.push(path.join(args[1], fileName));
    }
    else {
        filePaths.push(path.join(ctx.cwd, args[1], fileName));
    }

    await fsP.access(filePaths[0], fsP.constants.F_OK)
        .catch((error) => { throw error; });

    await fsP.access(filePaths[1], fsP.constants.F_OK)
        .then(() => {
            throw new Error();
        }).catch((error) => { if (error.code !== 'ENOENT') throw error; });

    await new Promise((resolve, reject) => {
        const srcStream = fs.createReadStream(filePaths[0], { flag: 'rx' });
        const dstStream = fs.createWriteStream(filePaths[1], { flag: 'wx' });
        dstStream.on('finish', () => {
            dstStream.close();
            srcStream.close();
            resolve();
        });
        srcStream.on('error', (error) => {
            reject(error);
        });
        dstStream.on('error', (error) => {
            reject(error);
        });
        srcStream.pipe(dstStream);
    }
    ).catch((error) => { srcStream.close(); dstStream.close(); throw error; });
}

export {
    cmd_cp
}
