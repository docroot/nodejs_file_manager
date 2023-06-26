import path from 'path';

const cmd_up = (ctx, args) => {
    if (ctx.cwd !== ctx.rootDir) {
        const upDir = path.dirname(ctx.cwd);
        process.chdir(upDir);
        ctx.cwd = process.cwd();
    }
}

export {
    cmd_up
}

