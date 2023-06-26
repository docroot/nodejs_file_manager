import { cmd_cp } from './cp.js';
import { cmd_rm } from './rm.js';

const cmd_mv = async (ctx, args) => {
    if (args.length !== 2) throw new Error();
    await cmd_cp(ctx, args);
    await cmd_rm(ctx, [args[0]]);
}

export {
    cmd_mv
}
