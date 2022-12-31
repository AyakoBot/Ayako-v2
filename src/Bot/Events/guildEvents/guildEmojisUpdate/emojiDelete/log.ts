import type * as DDeno from 'discordeno';
import client from '../../../../BaseClient/DDenoClient.js';

export default async (emoji: DDeno.Emoji, guild: DDeno.Guild) => {
  if (!emoji.id) return;

  const channels = await client.ch.getLogChannels('emojievents', { guildId: guild.id });
  if (!channels) return;

  const emote = await client.helpers.getEmoji(guild.id, emoji.id);
  const language = await client.ch.languageSelector(guild.id);
  const lan = language.events.logs.guild;
  const con = client.customConstants.events.logs.emoji;

  const embed: DDeno.Embed = {
    author: {
      iconUrl: con.delete,
      name: lan.emojiDelete,
    },
    description: emote.user
      ? lan.descEmojiDeleteAudit(emote.user, emote)
      : lan.descEmojiDelete(emote),
    fields: [],
    color: client.customConstants.colors.warning,
  };

  const url = client.helpers.getEmojiURL(emoji.id, emote.toggles.animated);
  client.ch.mergeLogging(url, emote.name, 'icon', embed, language);

  client.ch.send(
    { id: channels, guildId: guild.id },
    { embeds: [embed] },
    language,
    undefined,
    10000,
  );
};
