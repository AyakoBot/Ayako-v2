import type * as Discord from 'discord.js';
import client from '../../../../BaseClient/Client.js';

export default async (event: Discord.GuildScheduledEvent, user: Discord.User) => {
  if (!event.guild) return;

  const channels = await client.ch.getLogChannels('scheduledeventevents', event.guild);
  if (!channels) return;

  const channel =
    event.channel ??
    (event.channelId
      ? (await client.ch.getChannel.guildTextChannel(event.channelId)) ??
        (await client.ch.getChannel.guildVoiceChannel(event.channelId))
      : undefined);
  const language = await client.ch.languageSelector(event.guild.id);
  const lan = language.events.logs.scheduledEvent;
  const con = client.customConstants.events.logs.guild;
  const files: Discord.AttachmentPayload[] = [];

  const embed: Discord.APIEmbed = {
    author: {
      name: lan.nameUserRemove,
      icon_url: con.MemberDelete,
    },
    color: client.customConstants.colors.danger,
    description: channel
      ? lan.descUserRemoveChannel(user, event, channel, language.channelTypes[channel.type])
      : lan.descUserRemove(user, event),
  };

  client.ch.send(
    { id: channels, guildId: event.guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
