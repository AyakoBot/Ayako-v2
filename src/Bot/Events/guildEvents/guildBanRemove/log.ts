import type * as DDeno from 'discordeno';
import client from '../../../BaseClient/DDenoClient.js';

export default async (user: DDeno.User, guild: DDeno.Guild) => {
  const channels = await client.ch.getLogChannels('guildevents', { guildId: guild.id });
  if (!channels) return;

  const language = await client.ch.languageSelector(guild.id);
  const lan = language.events.logs.guild;
  const con = client.customConstants.events.logs.guild;
  const audit = await client.ch.getAudit(guild, 23, user.id);
  const auditUser =
    audit && audit?.userId ? await client.ch.cache.users.get(audit?.userId) : undefined;

  const embed: DDeno.Embed = {
    author: {
      iconUrl: con.BanRemove,
      name: lan.unban,
    },
    description: auditUser ? lan.descUnbanAudit(user, auditUser) : lan.descUnban(user),
    fields: [],
    color: client.customConstants.colors.success,
  };

  client.ch.send(
    { id: channels, guildId: guild.id },
    { embeds: [embed] },
    language,
    undefined,
    10000,
  );
};
