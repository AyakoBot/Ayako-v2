import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction<'cached'>) => {
 const channel = cmd.options.getChannel('channel', true, [
  Discord.ChannelType.GuildAnnouncement,
  Discord.ChannelType.GuildText,
  Discord.ChannelType.GuildVoice,
  Discord.ChannelType.GuildStageVoice,
  Discord.ChannelType.PublicThread,
  Discord.ChannelType.PrivateThread,
  Discord.ChannelType.AnnouncementThread,
 ]);
 const time = cmd.options.getNumber('time', true);
 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.slowmode;
 const me = await ch.getBotMemberFromGuild(cmd.guild);

 if (!me) {
  ch.error(cmd.guild, new Error("I can't find myself in this guild!"));
  return;
 }

 if (!ch.isManageable(channel, me)) {
  ch.errorCmd(cmd, language.t.errors.cantManageChannel, language);
  return;
 }

 const res = await ch.request.channels.edit(channel, {
  rate_limit_per_user: time,
 });

 if ('message' in res) {
  ch.errorCmd(cmd, res, language);
  return;
 }

 ch.replyCmd(cmd, {
  content:
   time === 0
    ? lan.deleted(channel as Discord.GuildChannel)
    : lan.success(channel as Discord.GuildChannel, ch.moment(time * 1000, language)),
 });
};
