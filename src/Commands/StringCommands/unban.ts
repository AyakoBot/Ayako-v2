import * as CT from '../../Typings/Typings.js';

export const takesFirstArg = true;
export const thisGuildOnly = [];
export const dmOnly = false;
export const dmAllowed = false;
export const type: CT.Command<typeof dmAllowed>['type'] = 'mod';
export const requiresSlashCommand = true;

const cmd: CT.Command<typeof dmAllowed>['default'] = async (msg, args) => {
 const reason = args?.slice(1).join(' ');
 const user = await msg.client.util.getTarget(msg, args);

 if (!user) return;
 if (await msg.client.util.isDeleteable(msg)) {
  await msg.client.util.request.channels.deleteMessage(msg);
 }

 const modOptions: CT.ModOptions<CT.ModTypes.BanRemove> = {
  reason: reason ?? '',
  guild: msg.guild,
  target: user,
  executor: msg.author,
  dbOnly: false,
  skipChecks: false,
 };

 msg.client.util.mod(msg, CT.ModTypes.BanRemove, modOptions);
};

export default cmd;
