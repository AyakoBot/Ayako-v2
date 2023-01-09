import * as Discord from 'discord.js';
import type * as DDeno from 'discordeno';
import type CT from '../../../Typings/CustomTypings';
import client from '../../../BaseClient/DDenoClient.js';

export default async (role: DDeno.Role) => {
  const channels = await client.ch.getLogChannels('roleevents', role);
  if (!channels) return;

  const guild = await client.cache.guilds.get(role.guildId);
  if (!guild) return;

  const language = await client.ch.languageSelector(role.guildId);
  const lan = language.events.logs.role;
  const con = client.customConstants.events.logs.role;
  const audit = role.botId ? undefined : await client.ch.getAudit(guild, 10, role.id);
  let auditUser = role.botId ? await client.cache.users.get(role.botId) : undefined;

  if (!auditUser && audit && audit.userId) auditUser = await client.cache.users.get(audit.userId);

  const embed: DDeno.Embed = {
    author: {
      iconUrl: con.create,
      name: lan.nameCreate,
    },
    description: auditUser ? lan.descCreateAudit(auditUser, role) : lan.descCreate(role),
    fields: [],
    color: client.customConstants.colors.success,
  };

  client.ch.send(
    { id: channels, guildId: role.guildId },
    { embeds: [embed] },
    language,
    undefined,
    10000,
  );
};
