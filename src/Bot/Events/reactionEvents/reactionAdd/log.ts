import type * as DDeno from 'discordeno';
import type CT from '../../../Typings/CustomTypings';
import client from '../../../BaseClient/DDenoClient.js';

export default async (reaction: CT.ReactionAdd) => {
  if (!reaction.guildId) return;

  const channels = await client.ch.getLogChannels('reactionevents', { guildId: reaction.guildId });
  if (!channels) return;

  const language = await client.ch.languageSelector(reaction.guildId);
  const lan = language.events.messageReactionAdd;
  const con = client.customConstants.events.messageReactionAdd;
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
        iconUrl: con.image,
        url: client.ch.getJumpLink(msg),
      },
      description: lan.description(user, msg, reaction),
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
    const blobs = await getBuffers();
    if (blobs[0]) {
      payload.files = blobs.filter((b): b is { name: string; blob: Blob } => !!b);

      embed.thumbnail = {
        url: `attachment://${blobs[0].name}`,
      };
    }
  }

  await client.ch.send(
    { id: channels, guildId: reaction.guildId },
    payload,
    language,
    undefined,
    10000,
  );
};
