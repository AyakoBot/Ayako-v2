import type * as Discord from 'discord.js';

export default async (cmd: Discord.MessageContextMenuCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const res = await cmd.client.util.DataBase.stickymessages
  .upsert({
   where: { channelid: cmd.channelId },
   create: {
    guildid: cmd.guildId,
    lastmsgid: cmd.targetId,
    channelid: cmd.channelId,
    userid: cmd.user.id,
   },
   update: {},
   select: { lastmsgid: true },
  })
  .then();

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.contextCommands.message['Stick Message'];

 cmd.client.util.replyCmd(cmd, {
  content: res?.lastmsgid === cmd.targetId ? lan.reply : lan.already,
 });
};
