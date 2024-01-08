import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (oldRole: Discord.Role, role: Discord.Role) => {
 if (oldRole.position !== role.position) return;
 if (oldRole.rawPosition !== role.rawPosition) return;

 const channels = await role.client.util.getLogChannels('roleevents', role.guild);
 if (!channels) return;

 const language = await role.client.util.getLanguage(role.guild.id);
 const lan = language.events.logs.role;
 const con = role.client.util.constants.events.logs.role;
 const audit = await role.client.util.getAudit(role.guild, 31, role.id);
 const auditUser = audit?.executor ?? undefined;
 const files: Discord.AttachmentPayload[] = [];

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.nameUpdate,
   icon_url: con.update,
  },
  color: CT.Colors.Loading,
  fields: [],
  description: auditUser ? lan.descUpdateAudit(role, auditUser) : lan.descUpdate(role),
  timestamp: new Date().toISOString(),
 };

 const embeds = [embed];

 const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
  role.client.util.mergeLogging(before, after, type, embed, language, name);

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

   const attachment = (await role.client.util.fileURL2Buffer([url]))?.[0]?.attachment;

   merge(url, role.client.util.getNameAndFileType(url), 'icon', lan.icon);

   if (attachment) {
    files.push({
     name: role.client.util.getNameAndFileType(url),
     attachment,
    });
   }
  };

  await getImage();
 }
 if (role.unicodeEmoji !== oldRole.unicodeEmoji) {
  merge(
   oldRole.unicodeEmoji ?? language.t.None,
   role.unicodeEmoji ?? language.t.None,
   'string',
   lan.unicodeEmoji,
  );
 }
 if (role.name !== oldRole.name) {
  merge(oldRole.name, role.name, 'string', language.t.name);
 }
 if (role.color !== oldRole.color) {
  merge(oldRole.hexColor, role.hexColor, 'string', language.t.color);
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
  const changedDenied = role.client.util.getDifference(
   Object.entries(newPermissions)
    .filter(([, b]) => !b)
    .map(([p]) => p),
   Object.entries(oldPermissions)
    .filter(([, b]) => !b)
    .map(([p]) => p),
  ) as (typeof language.permissions.perms)[];
  const changedAllowed = role.client.util.getDifference(
   Object.entries(newPermissions)
    .filter(([, b]) => !!b)
    .map(([p]) => p),
   Object.entries(oldPermissions)
    .filter(([, b]) => !!b)
    .map(([p]) => p),
  ) as (typeof language.permissions.perms)[];

  const permEmbed: Discord.APIEmbed = {
   color: CT.Colors.Ephemeral,
   description: `${changedDenied
    .map(
     (p) =>
      `${role.client.util.constants.standard.getEmote(role.client.util.emotes.disabled)} \`${
       language.permissions.perms[p as unknown as keyof typeof language.permissions.perms]
      }\``,
    )
    .join('\n')}\n${changedAllowed
    .map(
     (p) =>
      `${role.client.util.constants.standard.getEmote(role.client.util.emotes.enabled)} \`${
       language.permissions.perms[p as unknown as keyof typeof language.permissions.perms]
      }\``,
    )
    .join('\n')}`,
  };

  embeds.push(permEmbed);
 }

 role.client.util.send({ id: channels, guildId: role.guild.id }, { embeds, files }, 10000);
};
