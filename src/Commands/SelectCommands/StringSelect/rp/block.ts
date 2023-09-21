import type * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import { respond } from '../../../SlashCommands/rp/block.js';

export default async (cmd: Discord.StringSelectMenuInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.languageSelector(cmd.guildId);
 const userId = new URL(cmd.message.embeds[0].url || 'https://ayakobot.com').searchParams.get(
  'user',
 );
 const user = userId ? await ch.getUser(userId) : undefined;
 if (!userId || !user) {
  ch.errorCmd(cmd, language.errors.userNotExist, language);
  return;
 }

 const sel = await ch.DataBase.blockedusers.upsert({
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

 ch.DataBase.blockedusers
  .update({
   where: { userid_blockeduserid: { userid: cmd.user.id, blockeduserid: userId } },
   data: { blockedcmd: newBlockCmds },
  })
  .then();

 respond(cmd, user, { blockedcmd: newBlockCmds }, language);
};
