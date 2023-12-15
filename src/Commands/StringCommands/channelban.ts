import * as CT from '../../Typings/CustomTypings.js';
import * as ch from '../../BaseClient/ClientHelper.js';

export const takesFirstArg = true;
export const thisGuildOnly = [];
export const dmOnly = false;
export const dmAllowed = false;
export const type: CT.Command<typeof dmAllowed>['type'] = 'mod';
export const requiresSlashCommand = true;

const cmd: CT.Command<typeof dmAllowed>['default'] = async (msg, args) => {
 const user = await ch.getTarget(msg, args);
 const { channel, reason } = await ch.getTargetChannel(msg, args);

 if (!user) return;
 if (!channel) return;
 if (await ch.isDeleteable(msg)) await ch.request.channels.deleteMessage(msg);

 const modOptions: CT.ModOptions<'channelBanRemove'> = {
  reason,
  guild: msg.guild,
  target: user,
  executor: msg.author,
  dbOnly: false,
  skipChecks: false,
  channel: channel.isThread() ? (channel.parent as NonNullable<typeof channel.parent>) : channel,
 };

 ch.mod(msg, 'channelBanRemove', modOptions);
};

export default cmd;
