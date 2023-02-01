import * as Discord from 'discord.js';
import type CT from '../../../Typings/CustomTypings';
import client from '../../../BaseClient/Client.js';

export default async (oldRole: Discord.Role, role: Discord.Role) => {
  const channels = await client.ch.getLogChannels('roleevents', role.guild);
  if (!channels) return;

  const language = await client.ch.languageSelector(role.guild.id);
  const lan = language.events.logs.role;
  const con = client.customConstants.events.logs.role;
  const audit = await client.ch.getAudit(role.guild, 31, role.id);
  const auditUser = audit?.executor ?? undefined;
  const files: Discord.AttachmentPayload[] = [];

  const embed: Discord.APIEmbed = {
    author: {
      name: lan.nameUpdate,
      icon_url: con.update,
    },
    color: client.customConstants.colors.loading,
    fields: [],
    description: auditUser ? lan.descUpdateAudit(role, auditUser) : lan.descUpdate(role),
  };

  const embeds = [embed];

  const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
    client.ch.mergeLogging(before, after, type, embed, language, name);

  if (role.icon !== oldRole.icon) {
    const getImage = async () => {
      if (!role.icon) {
        embed.fields?.push({ name: lan.icon, value: lan.iconRemoved });
        return;
      }

      const url = role.iconURL({ size: 4096 });
      if (!url) {
        embed.fields?.push({ name: lan.icon, value: lan.iconRemoved });
        return;
      }

      const attachment = (await client.ch.fileURL2Buffer([url]))?.[0]?.attachment;

      merge(url, client.ch.getNameAndFileType(url), 'icon', lan.icon);

      if (attachment) {
        files.push({
          name: client.ch.getNameAndFileType(url),
          attachment,
        });
      }
    };

    await getImage();
  }
  if (role.unicodeEmoji !== oldRole.unicodeEmoji) {
    merge(oldRole.unicodeEmoji, role.unicodeEmoji, 'string', lan.unicodeEmoji);
  }
  if (role.name !== oldRole.name) {
    merge(oldRole.name, role.name, 'string', language.name);
  }
  if (role.color !== oldRole.color) {
    merge(oldRole.color.toString(), role.name.toString(), 'string', language.color);
  }
  if (role.hoist !== oldRole.hoist) {
    merge(oldRole.hoist, role.hoist, 'boolean', lan.hoisted);
  }
  if (role.mentionable !== oldRole.mentionable) {
    merge(oldRole.mentionable, role.mentionable, 'boolean', lan.mentionable);
  }
  if (role.permissions !== oldRole.permissions) {
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

    const permEmbed: Discord.APIEmbed = {
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
  }

  client.ch.send(
    { id: channels, guildId: role.guild.id },
    { embeds, files },
    language,
    undefined,
    10000,
  );
};
