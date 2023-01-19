import type * as Discord from 'discord.js';
import type CT from '../../../../Typings/CustomTypings';
import client from '../../../../BaseClient/Client.js';

export default async (
  event: CT.ScheduledEvent,
  payload: {
    guildScheduledEventId: bigint;
    guildId: bigint;
    userId: bigint;
  },
) => {
  const channels = await client.ch.getLogChannels('scheduledevents', event);
  if (!channels) return;

  const guild = await client.ch.cache.guilds.get(event.guild.id);
  if (!guild) return;

  const user = await client.users.fetch(payload.userId);
  if (!user) return;

  const channel = event.channelId
    ? await client.ch.cache.channels.get(event.channelId, event.guild.id)
    : undefined;
  const language = await client.ch.languageSelector(event.guild.id);
  const lan = language.events.logs.scheduledEvent;
  const con = client.customConstants.events.logs.guild;
  const files: DDeno.FileContent[] = [];

  const embed: Discord.APIEmbed = {
    author: {
      name: lan.nameUserRemove,
      icon_url: con.MemberDelete,
    },
    color: client.customConstants.colors.warning,
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
