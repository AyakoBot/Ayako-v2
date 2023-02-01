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
    fields: [],
    color: client.customConstants.colors.loading,
  };

  if (added?.size) {
    const userMentions = added.map((m) => `<@${m.id}>`).join(', ');

    if (userMentions.length > 1024) {
      const content = client.ch.txtFileWriter(userMentions, undefined, language.Added);
      if (content) files.push(content);
    } else {
      embed.fields?.push({
        name: lan.descJoinMember(thread, language.channelTypes[thread.type]),
        value: userMentions,
      });
    }

    embed.description = lan.descJoinMember(thread, language.channelTypes[thread.type]);
  }

  if (removed?.size) {
    const userMentions = removed.map((m) => `<@${m.id}>`).join(', ');

    if (userMentions.length > 1024) {
      const content = client.ch.txtFileWriter(userMentions, undefined, language.Added);
      if (content) files.push(content);
    } else {
      embed.fields?.push({
        name: lan.descJoinMember(thread, language.channelTypes[thread.type]),
        value: userMentions,
      });
    }

    embed.description = lan.descLeaveMember(thread, language.channelTypes[thread.type]);
  }

  client.ch.send(
    { id: channels, guildId: thread.guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
