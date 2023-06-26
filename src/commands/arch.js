import { error } from 'console';
import fs, { lstat } from 'fs';
import path from 'path';
import zlib from 'zlib';

const cmd_compress = async (ctx, args) => {
    if (args.length !== 1) throw new Error();
    let filePath;
    if (path.isAbsolute(args[0])) {
        filePath = args[0];
    }
    else {
        filePath = path.join(ctx.cwd, args[0]);
    }

    const archPath = filePath + '.br';

    const inputStream = fs.createReadStream(filePath);
    const writeStream = fs.createWriteStream(archPath, { flags: 'wx' });

    const brotliOptions = {
        chunkSize: 64 * 1024,
        params: {
            [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_GENERIC,
            [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
        },
    };
    const brotliStream = zlib.createBrotliCompress(brotliOptions);

    await new Promise((resolve, reject) => {
        inputStream.on('error', (error) => {
            reject(error);
        })
        brotliStream.on('error', (error) => {
            reject(error);
        })
        writeStream.on('error', (error) => {
            reject(error);
        });
        writeStream.on('finish', () => {
            resolve();
        });
        inputStream.pipe(brotliStream).pipe(writeStream);
    }
    ).catch((error) => { throw error; });
}

const cmd_decompress = async (ctx, args) => {
    if (args.length !== 1) throw new Error();
    let archPath;
    if (path.isAbsolute(args[0])) {
        archPath = args[0];
    }
    else {
        archPath = path.join(ctx.cwd, args[0]);
    }

    const re = /\.br$/;
    let filePath = archPath;
    if (re.test(filePath)) {
        filePath = filePath.slice(0, -3);
    }
    else {
        filePath = filePath + '.unpkd';
    }

    const inputStream = fs.createReadStream(archPath);
    const writeStream = fs.createWriteStream(filePath, { flags: 'wx' });

    const brotliStream = zlib.createBrotliDecompress();

    await new Promise((resolve, reject) => {
        inputStream.on('error', (error) => {
            reject(error);
        })
        brotliStream.on('error', (error) => {
            reject(error);
        })
        writeStream.on('error', (error) => {
            reject(error);
        });
        writeStream.on('finish', () => {
            resolve();
        });
        inputStream.pipe(brotliStream).pipe(writeStream);
    }
    ).catch((error) => { throw error; });
}

export {
    cmd_compress,
    cmd_decompress
}
