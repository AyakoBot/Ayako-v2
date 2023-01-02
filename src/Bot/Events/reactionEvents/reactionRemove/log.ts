import type * as DDeno from 'discordeno';
import type CT from '../../../Typings/CustomTypings';
import client from '../../../BaseClient/DDenoClient.js';

export default async (reaction: CT.ReactionRemove) => {
  if (!reaction.guildId) return;

  const channels = await client.ch.getLogChannels('reactionevents', { guildId: reaction.guildId });
  if (!channels) return;

  const language = await client.ch.languageSelector(reaction.guildId);
  const lan = language.events.messageReactionRemove;
  const con = client.customConstants.events.logs.reaction;
  const user = await client.cache.users.get(reaction.userId);
  if (!user) return;

  const message = await client.cache.messages.get(
    reaction.messageId,
    reaction.channelId,
    reaction.guildId,
  );
  if (!message) return;
  const msg = await (
    await import('../../messageEvents/messageCreate/messageCreate.js')
  ).convertMsg(message);

  const getEmbed = () => {
    const embed: DDeno.Embed = {
      author: {
        name: lan.title,
        iconUrl: con.remove,
        url: client.ch.getJumpLink(msg),
      },
      description: lan.description(user, reaction, msg),
      color: client.customConstants.colors.warning,
      fields: [],
    };

    return embed;
  };

  const embed = getEmbed();

  const getBuffers = async () => {
    let emoji = await client.ch.fileURL2Buffer([
      `https://cdn.discordapp.com/emojis/${reaction.emoji.id}.gif?size=240`,
    ]);

    if (!emoji[0]?.blob.size) {
      emoji = await client.ch.fileURL2Buffer([
        `https://cdn.discordapp.com/emojis/${reaction.emoji.id}.png?size=240`,
      ]);
    }
    return emoji;
  };

  const payload: { embeds: DDeno.Embed[]; files: DDeno.FileContent[] } = {
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
