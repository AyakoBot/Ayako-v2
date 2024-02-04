import * as Discord from 'discord.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const messageID = args.shift() as string;
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.giveaway.end;
 const giveaway = await cmd.client.util.DataBase.giveaways.findUnique({
  where: { msgid: messageID, ended: true },
 });

 if (!giveaway || giveaway.guildid !== cmd.guildId) {
  cmd.client.util.errorCmd(cmd, language.slashCommands.giveaway.notFoundOrEnded, language);
  return;
 }

 if (
  !cmd.client.util.importCache.Events.BotEvents.messageEvents.messageCreate.commandHandler.file.checkCommandPermissions(
   {
    guildId: cmd.guildId,
    guild: cmd.guild,
    author: cmd.user,
    channelId: cmd.channelId,
    member: cmd.member,
   },
   'giveaway',
  )
 ) {
  cmd.client.util.errorCmd(cmd, language.permissions.error.you, language);
  return;
 }

 await cmd.client.util.request.channels.deleteMessage(cmd.message);

 await cmd.client.util.importCache.Commands.SlashCommands.giveaway.end.file.end(giveaway);

 cmd.client.util.replyCmd(cmd, { content: lan.rerolling });
};
