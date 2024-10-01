import * as CT from '../../Typings/Typings.js';
import all from '../SlashCommands/mod/clear/all.js';

export const takesFirstArg = true;
export const thisGuildOnly = [];
export const dmOnly = false;
export const dmAllowed = false;
export const type: CT.Command<typeof dmAllowed>['type'] = 'mod';
export const requiresSlashCommand = true;

const cmd: CT.Command<typeof dmAllowed>['default'] = async (msg, args) => {
 if (!msg.inGuild()) return;

 all(msg, args, 'all');
};

export default cmd;
