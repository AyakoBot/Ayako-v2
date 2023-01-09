import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

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
  if (!payload.guildId) return;

  const channels = await client.ch.getLogChannels('reactionevents', { guildId: payload.guildId });
  if (!channels) return;

  const language = await client.ch.languageSelector(payload.guildId);
  const lan = language.events.logs.reaction;
  const con = client.customConstants.events.logs.reaction;
  const files: DDeno.FileContent[] = [];

  const embed: DDeno.Embed = {
    author: {
      name: lan.nameRemoveAll,
      iconUrl: con.remove,
      url: client.ch.getJumpLink({
        id: payload.messageId,
        channelId: payload.channelId,
        guildId: payload.guildId,
      }),
    },
    description: lan.descRemovedAll({
      id: payload.messageId,
      channelId: payload.channelId,
      guildId: payload.guildId,
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
    { id: channels, guildId: payload.guildId },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
