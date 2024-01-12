import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

export default async (role: Discord.Role) => {
 const channels = await role.client.util.getLogChannels('roleevents', role.guild);
 if (!channels) return;

 const language = await role.client.util.getLanguage(role.guild.id);
 const lan = language.events.logs.role;
 const con = role.client.util.constants.events.logs.role;
 const audit = role.tags?.botId
  ? undefined
  : await role.client.util.getAudit(role.guild, 30, role.id);
 const auditUser =
  (role.tags?.botId ? await role.client.util.getUser(role.tags.botId) : audit?.executor) ??
  undefined;
 const files: Discord.AttachmentPayload[] = [];

 const embed: Discord.APIEmbed = {
  author: {
   icon_url: con.remove,
   name: lan.nameDelete,
  },
  description: auditUser ? lan.descDeleteAudit(auditUser, role) : lan.descDelete(role),
  fields: [],
  color: CT.Colors.Danger,
  timestamp: new Date().toISOString(),
 };

 if (role.icon) {
  const attachments = (
   await role.client.util.fileURL2Buffer([role.iconURL({ size: 4096 })])
  ).filter((e): e is Discord.AttachmentPayload => !!e);

  if (attachments?.length) files.push(...attachments);
 }

 const flagsText = [
  role.managed ? lan.managed : null,
  role.hoist ? lan.hoisted : null,
  role.mentionable ? lan.mentionable : null,
  role.tags?.premiumSubscriberRole ? lan.boosterRole : null,
 ]
  .filter((f): f is string => !!f)
  .map((f) => `\`${f}\``)
  .join(', ');

 if (flagsText) {
  embed.fields?.push({
   name: language.t.Flags,
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
   name: language.t.name,
   value: role.name,
  });
 }

 if (role.color) {
  embed.fields?.push({
   name: language.t.color,
   value: role.color.toString(16),
  });
 }

 const permEmbed: Discord.APIEmbed = {
  color: CT.Colors.Ephemeral,
  description: Object.entries(new Discord.PermissionsBitField(role.permissions).serialize(false))
   .map(
    ([name, value]) =>
     `${
      value
       ? role.client.util.constants.standard.getEmote(role.client.util.emotes.enabled)
       : role.client.util.constants.standard.getEmote(role.client.util.emotes.disabled)
     } \`${language.permissions.perms[name as keyof typeof language.permissions.perms]}\``,
   )
   .join('\n'),
 };

 role.client.util.send(
  { id: channels, guildId: role.guild.id },
  { embeds: [embed, permEmbed], files },
  10000,
 );
};
