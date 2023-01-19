import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (emote: Discord.GuildEmoji) => {
  const channels = await client.ch.getLogChannels('emojievents', emote.guild);
  if (!channels) return;

  const language = await client.ch.languageSelector(emote.guild.id);
  const lan = language.events.logs.guild;
  const con = client.customConstants.events.logs.emoji;
  const audit = !emote.author ? await client.ch.getAudit(emote.guild, 62, emote.id) : undefined;
  const auditUser = emote.author ?? (await emote.fetchAuthor()) ?? audit?.executor ?? undefined;

  const files: Discord.AttachmentPayload[] = [];

  const embed: Discord.APIEmbed = {
    author: {
      icon_url: con.delete,
      name: lan.emojiDelete,
    },
    description: auditUser
      ? lan.descEmojiDeleteAudit(auditUser, emote)
      : lan.descEmojiDelete(emote),
    fields: [],
    color: client.customConstants.colors.warning,
  };

  const attachment = (await client.ch.fileURL2Buffer([emote.url]))?.[0]?.attachment;
  client.ch.mergeLogging(emote.url, emote.name, 'icon', embed, language);

  if (attachment) {
    files.push({
      name: String(emote.name),
      attachment,
    });
  }

  client.ch.send(
    { id: channels, guildId: emote.guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
