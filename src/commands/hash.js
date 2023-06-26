import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const cmd_hash = async (ctx, args) => {
    if (args.length !== 1) throw new Error();
    let filePath;
    if (path.isAbsolute(args[0])) {
        filePath = args[0];
    }
    else {
        filePath = path.join(ctx.cwd, args[0]);
    }

    const hash = crypto.createHash('sha256');
    const inputStream = fs.createReadStream(filePath);

    await new Promise((resolve, reject) => {
        inputStream.on('end', () => {
            inputStream.close();
        })
        inputStream.on('error', (error) => {
            reject(error);
        })
        hash.on('finish', () => {
            resolve();
        });
        inputStream.pipe(hash);
    }
    ).catch((error) => { throw error; });

    console.log(hash.digest('hex'));
}

export {
    cmd_hash
}
