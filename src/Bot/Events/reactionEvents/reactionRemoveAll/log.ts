import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (payload: { channelId: bigint; messageId: bigint; guildId?: bigint }) => {
  if (!payload.guildId) return;

  const channels = await client.ch.getLogChannels('reactionevents', { guildId: payload.guildId });
  if (!channels) return;

  const language = await client.ch.languageSelector(payload.guildId);
  const lan = language.events.messageReactionRemoveAll;
  const con = client.customConstants.events.logs.reaction;
  const message = await client.cache.messages.get(payload.channelId, payload.messageId);
  if (!message) return;

  const msg = await (
    await import('../../messageEvents/messageCreate/messageCreate')
  ).convertMsg(message);

  const getEmbed = () => {
    const embed: DDeno.Embed = {
      author: {
        name: lan.title,
        iconUrl: con.remove,
        url: client.ch.getJumpLink(msg),
      },
      description: lan.description(msg),
      color: client.customConstants.colors.warning,
      fields: [],
    };

    return embed;
  };

  const embed = getEmbed();

  client.ch.send(
    { id: channels, guildId: payload.guildId },
    { embeds: [embed] },
    msg.language,
    undefined,
    10000,
  );
};
