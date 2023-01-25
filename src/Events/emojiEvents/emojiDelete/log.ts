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
  if (attachment) {
    files.push({
      name: client.ch.getNameAndFileType(emote.url),
      attachment,
    });

    embed.thumbnail = {
      url: `attachment://${client.ch.getNameAndFileType(emote.url)}`,
    };
  }

  client.ch.send(
    { id: channels, guildId: emote.guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
