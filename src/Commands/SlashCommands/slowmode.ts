import * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
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
 const reason = cmd.options.getString('reason', false);

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.slowmode;

 if (!channel.manageable) {
  ch.errorCmd(cmd, language.errors.cantManageChannel, language);
  return;
 }

 const res = await channel
  .setRateLimitPerUser(time, `${cmd.user.tag} | ${reason ?? language.noReasonProvided}`)
  .catch((err) => err as Discord.DiscordAPIError);

 if ('message' in res) {
  ch.errorCmd(cmd, res.message, language);
  return;
 }

 ch.replyCmd(cmd, {
  content:
   time === 0
    ? lan.deleted(channel as Discord.GuildChannel)
    : lan.success(channel as Discord.GuildChannel, ch.moment(time * 1000, language)),
 });
};
