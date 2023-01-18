import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (
  payload: { channelId: bigint; messageId: bigint; guildId?: bigint },
  cache: Map<
    bigint | string,
    {
      count: number;
      users: bigint[];
      emoji: DDeno.Emoji;
    }
  >,
) => {
  if (!payload.guild.id) return;

  const channels = await client.ch.getLogChannels('reactionevents', { guildId: payload.guild.id });
  if (!channels) return;

  const language = await client.ch.languageSelector(payload.guild.id);
  const lan = language.events.logs.reaction;
  const con = client.customConstants.events.logs.reaction;
  const files: DDeno.FileContent[] = [];

  const embed: Discord.APIEmbed = {
    author: {
      name: lan.nameRemoveAll,
      icon_url: con.remove,
      url: client.ch.getJumpLink({
        id: payload.messageId,
        channelId: payload.channelId,
        guildId: payload.guild.id,
      }),
    },
    description: lan.descRemovedAll({
      id: payload.messageId,
      channelId: payload.channelId,
      guildId: payload.guild.id,
    } as DDeno.Message),
    color: client.customConstants.colors.warning,
    fields: [],
  };

  if (cache) {
    const reactions = Array.from(cache, ([, e]) => e);

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
      reactions.map((r) => r.users.map(String).join(', ')).join('\n'),
      undefined,
      lan.reactions,
    );

    if (users) files.push(users);
  }

  client.ch.send(
    { id: channels, guildId: payload.guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
