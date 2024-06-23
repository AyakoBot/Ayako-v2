import * as CT from '../../Typings/Typings.js';
import { isBlocked } from '../SlashCommands/mod/ban.js';

export const takesFirstArg = true;
export const thisGuildOnly = [];
export const dmOnly = false;
export const dmAllowed = false;
export const type: CT.Command<typeof dmAllowed>['type'] = 'mod';
export const requiresSlashCommand = true;

const cmd: CT.Command<typeof dmAllowed>['default'] = async (msg, args) => {
 const user = await msg.client.util.getTarget(msg, args);
 if (!user) return;

 const language = await msg.client.util.getLanguage(msg.guild.id);
 if (
  await isBlocked(
   msg,
   user,
   msg.guild.members.cache.get(user.id) ?? null,
   CT.ModTypes.KickAdd,
   language,
  )
 ) {
  return;
 }

 const reason = args?.slice(1).join(' ');

 const modOptions: CT.ModOptions<CT.ModTypes.KickAdd> = {
  reason: reason ?? '',
  guild: msg.guild,
  target: user,
  executor: msg.author,
  dbOnly: false,
  skipChecks: false,
 };

 msg.client.util.mod(msg, CT.ModTypes.KickAdd, modOptions);
};

export default cmd;
