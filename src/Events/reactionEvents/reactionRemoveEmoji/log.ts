import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (
  reaction: {
    channelId: bigint;
    messageId: bigint;
    guildId?: bigint;
    emoji: DDeno.Emoji;
  },
  cache?: {
    count: number;
    users: bigint[];
    emoji: DDeno.Emoji;
  },
) => {
  if (!reaction.guild.id) return;

  const channels = await client.ch.getLogChannels('reactionevents', { guildId: reaction.guild.id });
  if (!channels) return;

  const language = await client.ch.languageSelector(reaction.guild.id);
  const lan = language.events.logs.reaction;
  const con = client.customConstants.events.logs.reaction;
  const files: DDeno.FileContent[] = [];
  const msg = await client.ch.cache.messages.get(
    reaction.messageId,
    reaction.channelId,
    reaction.guild.id,
  );
  if (!msg) return;

  const embed: Discord.APIEmbed = {
    author: {
      name: lan.nameRemoveEmoji,
      icon_url: con.remove,
      url: client.ch.getJumpLink(msg),
    },
    description: lan.descRemoveEmoji(msg, reaction.emoji),
    color: client.customConstants.colors.warning,
    fields: [],
  };

  if (reaction.emoji.toggles.requireColons && reaction.emoji.id) {
    embed.thumbnail = {
      url: `attachment://${reaction.emoji.name ?? reaction.emoji.id}`,
    };

    const attachment = (
      await client.ch.fileURL2Blob([
        client.helpers.getEmojiURL(reaction.emoji.id, reaction.emoji.toggles.animated),
      ])
    ).filter(
      (
        e,
      ): e is {
        blob: Blob;
        name: string;
      } => !!e,
    );

    if (attachment) files.push(...attachment);
  }

  if (cache) {
    embed.fields?.push({
      name: lan.count,
      value: String(cache.count),
    });

    const users = client.ch.txtFileWriter(
      cache.users.map(String).join(', '),
      undefined,
      lan.reactions,
    );

    if (users) files.push(users);
  }

  await client.ch.send(
    { id: channels, guildId: reaction.guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
