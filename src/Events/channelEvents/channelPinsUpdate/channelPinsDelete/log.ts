import type * as Discord from 'discord.js';
import client from '../../../../BaseClient/Client.js';

export default async (
  msg: Discord.Message,
  channel:
    | Discord.NewsChannel
    | Discord.TextChannel
    | Discord.PrivateThreadChannel
    | Discord.PublicThreadChannel
    | Discord.VoiceChannel,
) => {
  const channels = await client.ch.getLogChannels('channelevents', channel.guild);
  if (!channels) return;

  const language = await client.ch.languageSelector(channel.guild.id);
  const lan = language.events.logs.channel;
  const con = client.customConstants.events.logs.channel;
  const audit = await client.ch.getAudit(channel.guild, 75);
  const auditUser = audit?.executor ?? undefined;

  const embed: Discord.APIEmbed = {
    author: {
      icon_url: con.Unpin,
      name: lan.nameUnpin,
    },
    description: auditUser
      ? lan.descPinRemoveAudit(auditUser, msg, language.channelTypes[msg.channel.type])
      : lan.descPinRemove(msg, language.channelTypes[msg.channel.type]),
    fields: [],
    color: client.customConstants.colors.success,
  };

  client.ch.send(
    { id: channels, guildId: channel.guild.id },
    { embeds: [embed] },
    language,
    undefined,
    10000,
  );
};
