import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (reaction: {
  channelId: bigint;
  messageId: bigint;
  guildId?: bigint;
  emoji: DDeno.Emoji;
}) => {
  if (!reaction.guildId) return;

  const channels = await client.ch.getLogChannels('reactionevents', { guildId: reaction.guildId });
  if (!channels) return;

  const language = await client.ch.languageSelector(reaction.guildId);
  const lan = language.events.messageReactionRemoveEmoji;
  const con = client.customConstants.events.messageReactionRemoveEmoji;
  const message = await client.cache.messages.get(reaction.channelId, reaction.messageId);
  if (!message) return;

  const msg = await (
    await import('../../messageEvents/messageCreate/messageCreate')
  ).convertMsg(message);

  const getEmbed = () => {
    const embed: DDeno.Embed = {
      type: 'rich',
      author: {
        name: lan.title,
        iconUrl: con.image,
        url: client.ch.getJumpLink(msg),
      },
      description: lan.description(reaction, msg),
      color: con.color,
      fields: [],
    };

    return embed;
  };

  const embed = getEmbed();

  const getBuffers = async () => {
    const emoji = await client.ch.fileURL2Buffer([
      `https://cdn.discordapp.com/emojis/${reaction.emoji.id}.${
        reaction.emoji.toggles.animated ? 'gif' : 'png'
      }?size=240`,
    ]);
    return emoji;
  };

  const payload: { embeds: DDeno.Embed[]; files?: DDeno.FileContent[] } = {
    embeds: [embed],
    files: [],
  };

  if (reaction.emoji.id) {
    const buffers = await getBuffers();
    payload.files = buffers.filter(
      (
        b,
      ): b is {
        blob: Blob;
        name: string;
      } => !!b,
    );

    embed.thumbnail = {
      url: `attachment://${buffers[0]?.name ?? Date.now()}`,
    };
  }

  await client.ch.send(
    { id: channels, guildId: reaction.guildId },
    payload,
    msg.language,
    undefined,
    10000,
  );
};
