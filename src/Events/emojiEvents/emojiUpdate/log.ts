import type * as Discord from 'discord.js';
import { ch } from '../../../BaseClient/Client.js';
import type CT from '../../../Typings/CustomTypings';

export default async (oldEmote: Discord.GuildEmoji, emote: Discord.GuildEmoji) => {
  const channels = await ch.getLogChannels('emojievents', emote.guild);
  if (!channels) return;

  const language = await ch.languageSelector(emote.guild.id);
  const lan = language.events.logs.guild;
  const con = ch.constants.events.logs.emoji;
  const audit = await ch.getAudit(emote.guild, 61, emote.id);
  const auditUser = audit?.executor ?? undefined;

  const embed: Discord.APIEmbed = {
    author: {
      icon_url: con.update,
      name: lan.emojiUpdate,
    },
    description: auditUser
      ? lan.descEmojiUpdateAudit(auditUser, emote)
      : lan.descEmojiUpdate(emote),
    fields: [],
    color: ch.constants.colors.loading,
  };

  const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
    ch.mergeLogging(before, after, type, embed, language, name);

  if (emote.name !== oldEmote.name) {
    merge(oldEmote.name, emote.name, 'string', language.name);
  }

  if (
    JSON.stringify(emote.roles.cache.map((r) => r.id)) !==
    JSON.stringify(oldEmote.roles.cache.map((r) => r.id))
  ) {
    merge(
      oldEmote.roles?.cache.map((r) => `<@&${r.id}>`) ?? language.none,
      emote.roles?.cache.map((r) => `<@&${r.id}>`) ?? language.none,
      'string',
      language.roles,
    );
  }

  ch.send({ id: channels, guildId: emote.guild.id }, { embeds: [embed] }, undefined, 10000);
};
