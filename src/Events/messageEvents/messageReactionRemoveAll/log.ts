import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (
  msg: Discord.Message,
  reactions: Discord.Collection<string | Discord.Snowflake, Discord.MessageReaction>,
) => {
  if (!msg.guild) return;

  const channels = await client.ch.getLogChannels('reactionevents', msg.guild);
  if (!channels) return;

  const language = await client.ch.languageSelector(msg.guild.id);
  const lan = language.events.logs.reaction;
  const con = client.customConstants.events.logs.reaction;
  const files: Discord.AttachmentPayload[] = [];

  const embed: Discord.APIEmbed = {
    author: {
      name: lan.nameRemoveAll,
      icon_url: con.remove,
      url: msg.url,
    },
    description: lan.descRemovedAll(msg),
    color: client.customConstants.colors.danger,
    fields: [],
  };

  if (reactions.size) {
    embed.fields?.push({
      name: lan.reactions,
      value: reactions
        ?.map(
          (r) =>
            `\`${client.ch.spaces(`${r.count}`, 5)}\` ${language.languageFunction.getEmote(
              r.emoji,
            )}`,
        )
        .join('\n'),
    });

    const users = client.ch.txtFileWriter(
      reactions.map((r) => r.users.cache.map(String).join(', ')).join('\n'),
      undefined,
      lan.reactions,
    );

    if (users) files.push(users);
  }

  client.ch.send(
    { id: channels, guildId: msg.guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
