import path from 'path';

const cmd_cd = (ctx, args) => {
    if (args.length > 1) throw new Error();
    let newDir;
    if (path.isAbsolute(args[0])) {
        newDir = args[0];
    }
    else {
        newDir = path.join(ctx.cwd, args[0]);
    }
    process.chdir(newDir);
    ctx.cwd = process.cwd();
}

export {
    cmd_cd
}