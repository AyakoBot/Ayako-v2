import type * as Discord from 'discord.js';
import { respond } from '../../../SlashCommands/rp/block.js';

export default async (cmd: Discord.StringSelectMenuInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const userId = new URL(cmd.message.embeds[0].url || 'https://ayakobot.com').searchParams.get(
  'user',
 );
 const user = userId ? await cmd.client.util.getUser(userId) : undefined;
 if (!userId || !user) {
  cmd.client.util.errorCmd(cmd, language.errors.userNotExist, language);
  return;
 }

 const sel = await cmd.client.util.DataBase.blockedusers.upsert({
  where: { userid_blockeduserid: { userid: cmd.user.id, blockeduserid: userId } },
  create: {
   userid: cmd.user.id,
   blockeduserid: userId,
  },
  update: {},
  select: { blockedcmd: true },
 });

 const newBlockCmds = [
  ...cmd.values.filter((v) => !sel.blockedcmd?.includes(v)),
  ...sel.blockedcmd.filter((v) => !cmd.values.includes(v)),
 ];

 cmd.client.util.DataBase.blockedusers
  .update({
   where: { userid_blockeduserid: { userid: cmd.user.id, blockeduserid: userId } },
   data: { blockedcmd: newBlockCmds },
  })
  .then();

 respond(cmd, user, { blockedcmd: newBlockCmds }, language);
};
