import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (user: DDeno.User, guild: DDeno.Guild) => {
  const channels = await client.ch.getLogChannels('channelevents', { guildId: guild.id });
  if (!channels) return;

  const language = await client.ch.languageSelector(guild.id);
  const lan = language.events.logs.guild;
  const con = client.customConstants.events.logs.guild;
  const audit = await client.ch.getAudit(guild, 22, user.id);
  const ban = await client.helpers.getBan(guild.id, user.id);
  const auditUser =
    audit && audit?.userId ? await client.cache.users.get(audit?.userId) : undefined;

  const embed: DDeno.Embed = {
    author: {
      iconUrl: con.banCreate,
      name: lan.ban,
    },
    description: auditUser ? lan.descBanAudit(user, auditUser) : lan.descBan(user),
    fields: [],
    color: client.customConstants.colors.success,
  };

  if (ban && ban.reason) {
    embed.fields?.push({ name: language.reason, value: ban.reason });
  }

  client.ch.send(
    { id: channels, guildId: guild.id },
    { embeds: [embed] },
    language,
    undefined,
    10000,
  );
};
