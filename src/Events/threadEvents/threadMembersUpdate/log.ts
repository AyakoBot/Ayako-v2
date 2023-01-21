import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (
  added: Discord.Collection<Discord.Snowflake, Discord.ThreadMember>,
  removed: Discord.Collection<Discord.Snowflake, Discord.ThreadMember>,
  thread: Discord.ThreadChannel,
) => {
  const channels = await client.ch.getLogChannels('channelevents', thread.guild);
  if (!channels) return;

  const language = await client.ch.languageSelector(thread.guild.id);
  const lan = language.events.logs.channel;
  const con = client.customConstants.events.logs.threadMembers;
  const files: Discord.AttachmentPayload[] = [];

  const embed: Discord.APIEmbed = {
    author: {
      name: lan.nameJoin,
      icon_url: con.update,
    },
    color: client.customConstants.colors.loading,
  };

  if (added?.size) {
    embed.fields?.push({
      name: lan.descJoinMember(thread, language.channelTypes[thread.type]),
      value: added.map((m) => `<@${m.id}>`).join(', '),
    });
  }

  if (removed?.size) {
    embed.fields?.push({
      name: lan.descJoinMember(thread, language.channelTypes[thread.type]),
      value: removed.map((m) => `<@${m}>`).join(', '),
    });
  }

  client.ch.send(
    { id: channels, guildId: thread.guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
