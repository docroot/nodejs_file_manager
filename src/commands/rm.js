import fs from 'fs/promises';
import path from 'path';

const cmd_rm = async (ctx, args) => {
    if (args.length !== 1) throw new Error();
    let filePath;
    if (path.isAbsolute(args[0])) {
        filePath = args[0];
    }
    else {
        filePath = path.join(ctx.cwd, args[0]);
    }

    const fileInfo = await fs.stat(filePath);
    if (fileInfo.isDirectory()) throw new Error();
    await fs.unlink(filePath);
}

export {
    cmd_rm
}
