import type * as Discord from 'discord.js';
import client from '../../../../BaseClient/Client.js';
import type CT from '../../../../Typings/CustomTypings';

export default async (
  afterEmoji: DDeno.DiscordEmoji,
  oldEmote: DDeno.Emoji,
  guild: DDeno.Guild,
) => {
  if (!afterEmoji.id) return;
  if (!oldEmote.id) return;

  const channels = await client.ch.getLogChannels('emojievents', { guildId: guild.id });
  if (!channels) return;

  const emote = await client.helpers.getEmoji(guild.id, afterEmoji.id);
  const language = await client.ch.languageSelector(guild.id);
  const lan = language.events.logs.guild;
  const con = client.customConstants.events.logs.emoji;
  const audit = await client.ch.getAudit(guild, 61, BigInt(afterEmoji.id));
  const auditUser = audit?.userId ? await client.users.fetch(audit.userId) : undefined;

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

  switch (true) {
    case emote.name !== oldEmote.name: {
      merge(oldEmote.name, emote.name, 'string', language.name);
      break;
    }
    case JSON.stringify(emote.roles) !== JSON.stringify(oldEmote.roles): {
      merge(
        oldEmote.roles?.map((r) => `<@&${r}>`) ?? language.none,
        emote.roles?.map((r) => `<@&${r}>`) ?? language.none,
        'string',
        language.roles,
      );
      break;
    }
    default: {
      return;
    }
  }

  client.ch.send(
    { id: channels, guildId: guild.id },
    { embeds: [embed] },
    language,
    undefined,
    10000,
  );
};
