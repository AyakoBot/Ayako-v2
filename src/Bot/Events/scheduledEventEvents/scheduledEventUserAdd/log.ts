import type * as DDeno from 'discordeno';
import type CT from '../../../Typings/CustomTypings';
import client from '../../../BaseClient/DDenoClient.js';

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

  const guild = await client.ch.cache.guilds.get(event.guildId);
  if (!guild) return;

  const user = await client.ch.cache.users.get(payload.userId);
  if (!user) return;

  const channel = event.channelId
    ? await client.ch.cache.channels.get(event.channelId, event.guildId)
    : undefined;
  const language = await client.ch.languageSelector(event.guildId);
  const lan = language.events.logs.scheduledEvent;
  const con = client.customConstants.events.logs.guild;
  const files: DDeno.FileContent[] = [];

  const embed: DDeno.Embed = {
    author: {
      name: lan.nameUserAdd,
      iconUrl: con.MemberDelete,
    },
    color: client.customConstants.colors.success,
    description: channel
      ? lan.descUserAddChannel(user, event, channel, language.channelTypes[channel.type])
      : lan.descUserAdd(user, event),
  };

  client.ch.send(
    { id: channels, guildId: event.guildId },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
