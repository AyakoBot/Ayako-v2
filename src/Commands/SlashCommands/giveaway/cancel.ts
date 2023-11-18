import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import { getButton, getGiveawayEmbed } from './end.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const messageID = cmd.options.getString('message-id', true);

 const giveaway = await ch.DataBase.giveaways.findUnique({
  where: { msgid: messageID },
 });

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.giveaway.cancel;

 if (!giveaway || giveaway.guildid !== cmd.guildId) {
  ch.errorCmd(cmd, language.slashCommands.giveaway.notFoundOrEnded, language);
  return;
 }

 const channel = await ch.getChannel.guildTextChannel(giveaway.channelid);
 if (!channel) {
  ch.errorCmd(cmd, language.t.errors.channelNotFound, language);
  return;
 }

 const giveawayEmbed = await getGiveawayEmbed(language, giveaway);
 giveawayEmbed.title = lan.cancelled;
 giveaway.ended = true;
 const participateButton = getButton(language, giveaway);

 const editRes = await ch.request.channels.editMessage(cmd.guild, channel.id, giveaway.msgid, {
  embeds: [giveawayEmbed],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [participateButton],
   },
  ],
 });

 if ('message' in editRes) {
  ch.errorCmd(cmd, editRes, language);
  return;
 }

 ch.DataBase.giveaways.update({ where: { msgid: messageID }, data: { ended: true } }).then();
 ch.cache.giveaways.delete(giveaway.guildid, giveaway.channelid, giveaway.msgid);

 ch.replyCmd(cmd, {
  content: lan.cancelled,
  files: giveaway.participants?.length ? [ch.txtFileWriter(giveaway.participants?.join(', '))] : [],
 });
};
