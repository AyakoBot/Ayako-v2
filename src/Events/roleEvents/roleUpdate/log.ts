import * as Discord from 'discord.js';
import type CT from '../../../Typings/CustomTypings.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (oldRole: Discord.Role, role: Discord.Role) => {
 if (oldRole.position !== role.position) return;
 if (oldRole.rawPosition !== role.rawPosition) return;

 const channels = await ch.getLogChannels('roleevents', role.guild);
 if (!channels) return;

 const language = await ch.getLanguage(role.guild.id);
 const lan = language.events.logs.role;
 const con = ch.constants.events.logs.role;
 const audit = await ch.getAudit(role.guild, 31, role.id);
 const auditUser = audit?.executor ?? undefined;
 const files: Discord.AttachmentPayload[] = [];

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.nameUpdate,
   icon_url: con.update,
  },
  color: ch.constants.colors.loading,
  fields: [],
  description: auditUser ? lan.descUpdateAudit(role, auditUser) : lan.descUpdate(role),
  timestamp: new Date().toISOString(),
 };

 const embeds = [embed];

 const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
  ch.mergeLogging(before, after, type, embed, language, name);

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

   const attachment = (await ch.fileURL2Buffer([url]))?.[0]?.attachment;

   merge(url, ch.getNameAndFileType(url), 'icon', lan.icon);

   if (attachment) {
    files.push({
     name: ch.getNameAndFileType(url),
     attachment,
    });
   }
  };

  await getImage();
 }
 if (role.unicodeEmoji !== oldRole.unicodeEmoji) {
  merge(
   oldRole.unicodeEmoji ?? language.None,
   role.unicodeEmoji ?? language.None,
   'string',
   lan.unicodeEmoji,
  );
 }
 if (role.name !== oldRole.name) {
  merge(oldRole.name, role.name, 'string', language.name);
 }
 if (role.color !== oldRole.color) {
  merge(oldRole.hexColor, role.hexColor, 'string', language.color);
 }
 if (role.hoist !== oldRole.hoist) {
  merge(oldRole.hoist, role.hoist, 'boolean', lan.hoisted);
 }
 if (role.flags.has(Discord.RoleFlags.InPrompt) !== oldRole.flags.has(Discord.RoleFlags.InPrompt)) {
  merge(
   oldRole.flags.has(Discord.RoleFlags.InPrompt),
   role.flags.has(Discord.RoleFlags.InPrompt),
   'boolean',
   lan.inOnboarding,
  );
 }
 if (role.mentionable !== oldRole.mentionable) {
  merge(oldRole.mentionable, role.mentionable, 'boolean', lan.mentionable);
 }
 if (role.permissions.bitfield !== oldRole.permissions.bitfield) {
  const oldPermissions = new Discord.PermissionsBitField(oldRole.permissions).serialize();
  const newPermissions = new Discord.PermissionsBitField(role.permissions).serialize();
  const changedDenied = ch.getDifference(
   Object.entries(newPermissions)
    .filter(([, b]) => !b)
    .map(([p]) => p),
   Object.entries(oldPermissions)
    .filter(([, b]) => !b)
    .map(([p]) => p),
  ) as (typeof language.permissions.perms)[];
  const changedAllowed = ch.getDifference(
   Object.entries(newPermissions)
    .filter(([, b]) => !!b)
    .map(([p]) => p),
   Object.entries(oldPermissions)
    .filter(([, b]) => !!b)
    .map(([p]) => p),
  ) as (typeof language.permissions.perms)[];

  const permEmbed: Discord.APIEmbed = {
   color: ch.constants.colors.ephemeral,
   description: `${changedDenied
    .map(
     (p) =>
      `${ch.constants.standard.getEmote(ch.emotes.disabled)} \`${
       language.permissions.perms[p as unknown as keyof typeof language.permissions.perms]
      }\``,
    )
    .join('\n')}\n${changedAllowed
    .map(
     (p) =>
      `${ch.constants.standard.getEmote(ch.emotes.enabled)} \`${
       language.permissions.perms[p as unknown as keyof typeof language.permissions.perms]
      }\``,
    )
    .join('\n')}`,
  };

  embeds.push(permEmbed);
 }

 ch.send({ id: channels, guildId: role.guild.id }, { embeds, files }, 10000);
};
