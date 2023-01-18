import type * as Discord from 'discord.js';
import client from '../../../../BaseClient/Client.js';

export default async (emoji: DDeno.Emoji, guild: DDeno.Guild) => {
  if (!emoji.id) return;

  const channels = await client.ch.getLogChannels('emojievents', { guildId: guild.id });
  if (!channels) return;

  const emote = await client.helpers.getEmoji(guild.id, emoji.id);
  const language = await client.ch.languageSelector(guild.id);
  const lan = language.events.logs.guild;
  const con = client.customConstants.events.logs.emoji;
  const files: DDeno.FileContent[] = [];

  const embed: Discord.APIEmbed = {
    author: {
      icon_url: con.delete,
      name: lan.emojiDelete,
    },
    description: emote.user
      ? lan.descEmojiDeleteAudit(emote.user, emote)
      : lan.descEmojiDelete(emote),
    fields: [],
    color: client.customConstants.colors.warning,
  };

  const url = client.helpers.getEmojiURL(emoji.id, emote.toggles.animated);
  const blob = (await client.ch.fileURL2Blob([url]))?.[0]?.blob;
  client.ch.mergeLogging(url, emote.name, 'icon', embed, language);

  if (blob) {
    files.push({
      name: String(emote.name),
      blob,
    });
  }

  client.ch.send(
    { id: channels, guildId: guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
