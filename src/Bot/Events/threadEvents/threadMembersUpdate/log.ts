import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';
import type CT from '../../../Typings/CustomTypings';

export default async (
  thread: CT.Thread,
  payload: {
    id: bigint;
    guildId: bigint;
    addedMembers?: DDeno.ThreadMember[];
    removedMemberIds?: bigint[];
  },
) => {
  const channels = await client.ch.getLogChannels('channelevents', payload);
  if (!channels) return;

  const language = await client.ch.languageSelector(thread.guildId);
  const lan = language.events.logs.channel;
  const con = client.customConstants.events.logs.threadMembers;
  const files: DDeno.FileContent[] = [];

  const embed: DDeno.Embed = {
    author: {
      name: lan.nameJoin,
      iconUrl: con.update,
    },
    color: client.customConstants.colors.loading,
  };

  if (payload.addedMembers?.length) {
    embed.fields?.push({
      name: lan.descJoinMember(thread, language.channelTypes[thread.type]),
      value: payload.addedMembers.map((m) => `<@${m.id}>`).join(', '),
    });
  }

  if (payload.removedMemberIds?.length) {
    embed.fields?.push({
      name: lan.descJoinMember(thread, language.channelTypes[thread.type]),
      value: payload.removedMemberIds.map((m) => `<@${m}>`).join(', '),
    });
  }

  client.ch.send(
    { id: channels, guildId: payload.guildId },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
