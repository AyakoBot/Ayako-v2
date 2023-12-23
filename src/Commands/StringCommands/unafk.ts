import * as ch from '../../BaseClient/ClientHelper.js';
import * as CT from '../../Typings/Typings.js';

export const takesFirstArg = true;
export const thisGuildOnly = [];
export const dmOnly = false;
export const dmAllowed = false;
export const type: CT.Command<typeof dmAllowed>['type'] = 'mod';
export const requiresSlashCommand = true;

const cmd: CT.Command<typeof dmAllowed>['default'] = async (msg, args) => {
 const reason = args?.slice(1).join(' ');
 const user = await ch.getTarget(msg, args);

 if (!user) return;
 if (await ch.isDeleteable(msg)) await ch.request.channels.deleteMessage(msg);

 const modOptions: CT.ModOptions<CT.ModTypes.UnAfk> = {
  reason: reason ?? '',
  guild: msg.guild,
  target: user,
  executor: msg.author,
  dbOnly: false,
  skipChecks: false,
 };

 ch.mod(msg, CT.ModTypes.UnAfk, modOptions);
};

export default cmd;
