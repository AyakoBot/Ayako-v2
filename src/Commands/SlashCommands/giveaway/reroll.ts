import * as Discord from 'discord.js';
import { end } from '../../SlashCommands/giveaway/end.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const messageId = cmd.options.getString('message-id', true);

 const giveaway = await cmd.client.util.DataBase.giveaways.findUnique({
  where: { msgid: messageId },
 });

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.giveaway.end;

 if (!giveaway || giveaway.guildid !== cmd.guildId) {
  cmd.client.util.errorCmd(cmd, language.slashCommands.giveaway.notFoundOrEnded, language);
  return;
 }

 const channel = await cmd.client.util.getChannel.guildTextChannel(giveaway.channelid);
 if (!channel) {
  cmd.client.util.errorCmd(cmd, language.errors.channelNotFound, language);
  return;
 }

 await end(giveaway);

 cmd.client.util.replyCmd(cmd, { content: lan.rerolling });
};
