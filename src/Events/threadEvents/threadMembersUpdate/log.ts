import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';
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

  const language = await client.ch.languageSelector(thread.guild.id);
  const lan = language.events.logs.channel;
  const con = client.customConstants.events.logs.threadMembers;
  const files: DDeno.FileContent[] = [];

  const embed: Discord.APIEmbed = {
    author: {
      name: lan.nameJoin,
      icon_url: con.update,
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
    { id: channels, guildId: payload.guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
