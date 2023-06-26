import fs from 'fs/promises';
import path from 'path';

const cmd_rn = async (ctx, args) => {
    if (args.length !== 2) throw new Error();
    let filePaths = [];
    args.forEach(file => {
        if (path.isAbsolute(file)) {
            filePaths.push(file);
        }
        else {
            filePaths.push(path.join(ctx.cwd, file));
        }
    });
    console.log(filePaths);
    await fs.access(filePaths[1], fs.constants.F_OK)
        .then(() => {
            throw new Error();
        });
    await fs.rename(filePaths[0], filePaths[1]);
}

export {
    cmd_rn
}
