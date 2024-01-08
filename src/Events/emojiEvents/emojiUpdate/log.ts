import type * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (oldEmote: Discord.GuildEmoji, emote: Discord.GuildEmoji) => {
 const channels = await emote.client.util.getLogChannels('emojievents', emote.guild);
 if (!channels) return;

 const language = await emote.client.util.getLanguage(emote.guild.id);
 const lan = language.events.logs.guild;
 const con = emote.client.util.constants.events.logs.emoji;
 const audit = await emote.client.util.getAudit(emote.guild, 61, emote.id);
 const auditUser = audit?.executor ?? undefined;

 const embed: Discord.APIEmbed = {
  author: {
   icon_url: con.update,
   name: lan.emojiUpdate,
  },
  description: auditUser ? lan.descEmojiUpdateAudit(auditUser, emote) : lan.descEmojiUpdate(emote),
  fields: [],
  color: CT.Colors.Loading,
  timestamp: new Date().toISOString(),
 };

 const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
  emote.client.util.mergeLogging(before, after, type, embed, language, name);

 if (emote.name !== oldEmote.name) {
  merge(oldEmote.name, emote.name, 'string', language.t.name);
 }

 if (
  JSON.stringify(emote.roles.cache.map((r) => r.id)) !==
  JSON.stringify(oldEmote.roles.cache.map((r) => r.id))
 ) {
  merge(
   oldEmote.roles?.cache.map((r) => `<@&${r.id}>`) ?? language.t.None,
   emote.roles?.cache.map((r) => `<@&${r.id}>`) ?? language.t.None,
   'string',
   language.t.roles,
  );
 }

 emote.client.util.send({ id: channels, guildId: emote.guild.id }, { embeds: [embed] }, 10000);
};
