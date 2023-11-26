import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.MessageContextMenuCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const res = await ch.DataBase.stickymessages.findUnique({
  where: { channelid: cmd.channelId },
 });

 ch.DataBase.stickymessages
  .upsert({
   where: { channelid: cmd.channelId },
   create: {
    guildid: cmd.guildId,
    lastmsgid: cmd.targetId,
    channelid: cmd.channelId,
    userid: cmd.user.id,
   },
   update: {},
  })
  .then();

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.contextCommands.message['Stick Message'];

 ch.replyCmd(cmd, {
  content: res?.lastmsgid === cmd.targetId ? lan.reply : lan.already,
 });
};
