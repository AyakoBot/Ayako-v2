import Discord from 'discord.js';
import type * as Discord from 'discord.js';
import type CT from '../../../Typings/CustomTypings';
import client from '../../../BaseClient/Client.js';

export default async (oldRole: DDeno.Role, role: DDeno.Role) => {
  const channels = await client.ch.getLogChannels('roleevents', role);
  if (!channels) return;

  const guild = await client.ch.cache.guilds.get(role.guildId);
  if (!guild) return;

  const language = await client.ch.languageSelector(role.guildId);
  const lan = language.events.logs.role;
  const con = client.customConstants.events.logs.role;
  const audit = await client.ch.getAudit(guild, 31, role.id);
  const auditUser =
    audit && audit.userId ? await client.ch.cache.users.get(audit.userId) : undefined;
  const files: DDeno.FileContent[] = [];

  const embed: DDeno.Embed = {
    author: {
      name: lan.nameUpdate,
      iconUrl: con.update,
    },
    color: client.customConstants.colors.loading,
    description: auditUser ? lan.descUpdateAudit(role, auditUser) : lan.descUpdate(role),
  };

  const embeds = [embed];

  const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
    client.ch.mergeLogging(before, after, type, embed, language, name);

  switch (true) {
    case role.icon !== oldRole.icon: {
      const url = client.customConstants.standard.roleIconURL(role);

      if (url) {
        const blob = (await client.ch.fileURL2Blob([url]))?.[0]?.blob;

        merge(url, role.icon, 'icon', lan.icon);

        if (blob) {
          files.push({
            name: String(role.icon),
            blob,
          });
        }
      } else embed.fields?.push({ name: lan.icon, value: lan.iconRemoved });
      break;
    }
    case role.unicodeEmoji !== oldRole.unicodeEmoji: {
      merge(oldRole.unicodeEmoji, role.unicodeEmoji, 'string', lan.unicodeEmoji);
      break;
    }
    case role.name !== oldRole.name: {
      merge(oldRole.name, role.name, 'string', language.name);
      break;
    }
    case role.color !== oldRole.color: {
      merge(oldRole.color.toString(), role.name.toString(), 'string', language.color);
      break;
    }
    case role.toggles.hoist !== oldRole.toggles.hoist: {
      merge(oldRole.toggles.hoist, role.toggles.hoist, 'boolean', lan.hoisted);
      break;
    }
    case role.toggles.mentionable !== oldRole.toggles.mentionable: {
      merge(oldRole.toggles.mentionable, role.toggles.mentionable, 'boolean', lan.mentionable);
      break;
    }
    case role.permissions !== oldRole.permissions: {
      const oldPermissions = new Discord.PermissionsBitField(oldRole.permissions).serialize();
      const newPermissions = new Discord.PermissionsBitField(role.permissions).serialize();
      const changedDenied = client.ch.getDifference(
        Object.entries(newPermissions)
          .filter(([, b]) => !b)
          .map(([p]) => p),
        Object.entries(oldPermissions)
          .filter(([, b]) => !b)
          .map(([p]) => p),
      ) as (typeof language.permissions.perms)[];
      const changedAllowed = client.ch.getDifference(
        Object.entries(newPermissions)
          .filter(([, b]) => !!b)
          .map(([p]) => p),
        Object.entries(oldPermissions)
          .filter(([, b]) => !!b)
          .map(([p]) => p),
      ) as (typeof language.permissions.perms)[];

      const permEmbed: DDeno.Embed = {
        color: client.customConstants.colors.ephemeral,
        description: `${changedDenied
          .map(
            (p) =>
              `${client.stringEmotes.disabled} \`${
                language.permissions.perms[p as unknown as keyof typeof language.permissions.perms]
              }\``,
          )
          .join('\n')}\n${changedAllowed
          .map(
            (p) =>
              `${client.stringEmotes.disabled} \`${
                language.permissions.perms[p as unknown as keyof typeof language.permissions.perms]
              }\``,
          )
          .join('\n')}`,
      };

      embeds.push(permEmbed);
      break;
    }
    default: {
      return;
    }
  }

  client.ch.send(
    { id: channels, guildId: role.guildId },
    { embeds, files },
    language,
    undefined,
    10000,
  );
};
