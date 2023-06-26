import fs from 'fs';
import path from 'path';

const cmd_cat = async (ctx, args) => {
    if (args.length !== 1) throw new Error();
    let filePath;
    if (path.isAbsolute(args[0])) {
        filePath = args[0];
    }
    else {
        filePath = path.join(ctx.cwd, args[0]);
    }

    await new Promise((resolve, reject) => {
        const inputStream = fs.createReadStream(filePath, 'utf8');
        inputStream.pipe(process.stdout);
        inputStream.on('end', () => {
            inputStream.close();
            resolve();
        })
        inputStream.on('error', (error) => {
            reject(error);
        })
    }
    ).catch((error) => { throw error; });
}

export {
    cmd_cat
}
