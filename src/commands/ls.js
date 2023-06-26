import fs from 'fs/promises';
import path from 'path';

const cmd_ls = async (ctx, args) => {
    if (args.length > 1) throw new Error();
    let dir = ctx.cwd;
    if (args.length === 1) {
        if (path.isAbsolute(args[0])) {
            dir = args[0];
        }
        else {
            dir = path.join(ctx.cwd, args[0]);
        }
    }
    try {
        const files = await fs.readdir(dir);
        const filesInfo = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const filePath = path.join(dir, file);
            try {
                const fileStats = await fs.stat(filePath);
                filesInfo.push({ 'Name': file, 'Type': (fileStats.isDirectory() ? 'DIR' : 'File'), 'size': fileStats.size, });
            } catch (error) {
            }
        }
        filesInfo.sort((a, b) => {
            if (a.Type === b.Type) {
                return a.Name.localeCompare(b.Name);
            }
            if (a.Type === 'DIR') {
                return -1;
            }
            return 1;
        });
        console.table(filesInfo);
    } catch (error) {
        throw error;
    }
}

export {
    cmd_ls
}
