import * as Discord from 'discord.js';
import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (role: DDeno.Role) => {
  const channels = await client.ch.getLogChannels('roleevents', role);
  if (!channels) return;

  const guild = await client.ch.cache.guilds.get(role.guildId);
  if (!guild) return;

  const language = await client.ch.languageSelector(role.guildId);
  const lan = language.events.logs.role;
  const con = client.customConstants.events.logs.role;
  const audit = role.botId ? undefined : await client.ch.getAudit(guild, 30, role.id);
  let auditUser = role.botId ? await client.ch.cache.users.get(role.botId) : undefined;
  const files: DDeno.FileContent[] = [];

  if (!auditUser && audit && audit.userId) {
    auditUser = await client.ch.cache.users.get(audit.userId);
  }
  const embed: DDeno.Embed = {
    author: {
      iconUrl: con.create,
      name: lan.nameCreate,
    },
    description: auditUser ? lan.descCreateAudit(auditUser, role) : lan.descCreate(role),
    fields: [],
    color: client.customConstants.colors.success,
  };

  if (role.icon) {
    const url = client.customConstants.standard.roleIconURL(role);
    const attachments = (await client.ch.fileURL2Blob([url])).filter(
      (
        e,
      ): e is {
        blob: Blob;
        name: string;
      } => !!e,
    );

    if (attachments?.length) files.push(...attachments);
  }

  const flagsText = [
    role.toggles.managed ? lan.managed : null,
    role.toggles.hoist ? lan.hoisted : null,
    role.toggles.mentionable ? lan.mentionable : null,
    role.toggles.premiumSubscriber ? lan.boosterRole : null,
  ]
    .filter((f): f is string => !!f)
    .map((f) => `\`${f}\``)
    .join(', ');

  if (flagsText) {
    embed.fields?.push({
      name: language.Flags,
      value: flagsText,
      inline: true,
    });
  }

  if (role.unicodeEmoji) {
    embed.fields?.push({
      name: lan.unicodeEmoji,
      value: role.unicodeEmoji,
    });
  }

  if (role.name) {
    embed.fields?.push({
      name: language.name,
      value: role.name,
    });
  }

  if (role.color) {
    embed.fields?.push({
      name: language.color,
      value: role.color.toString(),
    });
  }

  const permEmbed: DDeno.Embed = {
    color: client.customConstants.colors.ephemeral,
    description: Object.entries(new Discord.PermissionsBitField(role.permissions).serialize(false))
      .map(
        ([name, value]) =>
          `${value ? client.stringEmotes.enabled : client.stringEmotes.disabled} \`${
            language.permissions.perms[name as keyof typeof language.permissions.perms]
          }\``,
      )
      .join('\n'),
  };

  client.ch.send(
    { id: channels, guildId: role.guildId },
    { embeds: [embed, permEmbed], files },
    language,
    undefined,
    10000,
  );
};
