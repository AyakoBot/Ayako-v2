import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';
import type CT from '../../../Typings/CustomTypings';

export default async (oldEmote: Discord.GuildEmoji, emote: Discord.GuildEmoji) => {
  const channels = await client.ch.getLogChannels('emojievents', emote.guild);
  if (!channels) return;

  const language = await client.ch.languageSelector(emote.guild.id);
  const lan = language.events.logs.guild;
  const con = client.customConstants.events.logs.emoji;
  const audit = await client.ch.getAudit(emote.guild, 61, emote.id);
  const auditUser =
    emote.author ??
    oldEmote.author ??
    (await emote.fetchAuthor()) ??
    (await oldEmote.fetchAuthor()) ??
    audit?.executor ??
    undefined;

  const embed: Discord.APIEmbed = {
    author: {
      icon_url: con.update,
      name: lan.emojiUpdate,
    },
    description: auditUser
      ? lan.descEmojiUpdateAudit(auditUser, emote)
      : lan.descEmojiUpdate(emote),
    fields: [],
    color: client.customConstants.colors.loading,
  };

  const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
    client.ch.mergeLogging(before, after, type, embed, language, name);

  if (emote.name !== oldEmote.name) {
    merge(oldEmote.name, emote.name, 'string', language.name);
  }

  if (JSON.stringify(emote.roles) !== JSON.stringify(oldEmote.roles)) {
    merge(
      oldEmote.roles?.cache.map((r) => `<@&${r.id}>`) ?? language.none,
      emote.roles?.cache.map((r) => `<@&${r.id}>`) ?? language.none,
      'string',
      language.roles,
    );
  }

  client.ch.send(
    { id: channels, guildId: emote.guild.id },
    { embeds: [embed] },
    language,
    undefined,
    10000,
  );
};
