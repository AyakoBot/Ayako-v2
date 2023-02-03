import type * as Discord from 'discord.js';
import client from '../../../../BaseClient/Client.js';

export default async (event: Discord.GuildScheduledEvent, user: Discord.User) => {
  const guild = event.guild ?? (event.guildId ? client.guilds.cache.get(event.guildId) : undefined);
  if (!guild) return;

  const channels = await client.ch.getLogChannels('scheduledeventevents', guild);
  if (!channels) return;

  const channel =
    event.channel ??
    (event.channelId
      ? (await client.ch.getChannel.guildTextChannel(event.channelId)) ??
        (await client.ch.getChannel.guildVoiceChannel(event.channelId))
      : undefined);
  const language = await client.ch.languageSelector(guild.id);
  const lan = language.events.logs.scheduledEvent;
  const con = client.customConstants.events.logs.guild;
  const files: Discord.AttachmentPayload[] = [];

  const embed: Discord.APIEmbed = {
    author: {
      name: lan.nameUserAdd,
      icon_url: con.MemberDelete,
    },
    color: client.customConstants.colors.success,
    description: channel
      ? lan.descUserAddChannel(user, event, channel, language.channelTypes[channel.type])
      : lan.descUserAdd(user, event),
  };

  client.ch.send(
    { id: channels, guildId: guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
