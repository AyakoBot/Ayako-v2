import * as Discord from 'discord.js';
import { getButton, getGiveawayEmbed } from './end.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const messageID = cmd.options.getString('message-id', true);

 const giveaway = await cmd.client.util.DataBase.giveaways.findUnique({
  where: { msgid: messageID },
 });

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.giveaway.cancel;

 if (!giveaway || giveaway.guildid !== cmd.guildId) {
  cmd.client.util.errorCmd(cmd, language.slashCommands.giveaway.notFoundOrEnded, language);
  return;
 }

 const channel = await cmd.client.util.getChannel.guildTextChannel(giveaway.channelid);
 if (!channel) {
  cmd.client.util.errorCmd(cmd, language.errors.channelNotFound, language);
  return;
 }

 const giveawayEmbed = await getGiveawayEmbed(language, giveaway);
 giveawayEmbed.title = lan.cancelled;
 giveaway.ended = true;
 const participateButton = getButton(language, giveaway);

 const editRes = await cmd.client.util.request.channels.editMessage(
  cmd.guild,
  channel.id,
  giveaway.msgid,
  {
   embeds: [giveawayEmbed],
   components: [
    {
     type: Discord.ComponentType.ActionRow,
     components: [participateButton],
    },
   ],
  },
 );

 if ('message' in editRes) {
  cmd.client.util.errorCmd(cmd, editRes, language);
  return;
 }

 cmd.client.util.DataBase.giveaways
  .update({ where: { msgid: messageID }, data: { ended: true } })
  .then();
 cmd.client.util.cache.giveaways.delete(giveaway.guildid, giveaway.channelid, giveaway.msgid);

 cmd.client.util.replyCmd(cmd, {
  content: lan.cancelled,
  files: giveaway.participants?.length
   ? [cmd.client.util.txtFileWriter(giveaway.participants?.join(', '))]
   : [],
 });
};
