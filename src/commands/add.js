import fs from 'fs/promises';
import path from 'path';

const cmd_add = async (ctx, args) => {
    if (args.length !== 1) throw new Error();
    let filePath;
    if (path.isAbsolute(args[0])) {
        filePath = args[0];
    }
    else {
        filePath = path.join(ctx.cwd, args[0]);
    }

    await fs.writeFile(filePath, '', { flag: 'wx' });
}

export {
    cmd_add
}
