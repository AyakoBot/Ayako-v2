import type * as DDeno from 'discordeno';
import client from '../../../../BaseClient/DDenoClient.js';

export default async (emoji: DDeno.DiscordEmoji, guild: DDeno.Guild) => {
  if (!emoji.id) return;

  const channels = await client.ch.getLogChannels('emojievents', { guildId: guild.id });
  if (!channels) return;

  const emote = await client.helpers.getEmoji(guild.id, emoji.id);
  const language = await client.ch.languageSelector(guild.id);
  const lan = language.events.logs.guild;
  const con = client.customConstants.events.logs.emoji;
  const files: DDeno.FileContent[] = [];

  const embed: DDeno.Embed = {
    author: {
      iconUrl: con.create,
      name: lan.emojiCreate,
    },
    description: emote.user
      ? lan.descEmojiCreateAudit(emote.user, emote)
      : lan.descEmojiCreate(emote),
    fields: [],
    color: client.customConstants.colors.success,
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
