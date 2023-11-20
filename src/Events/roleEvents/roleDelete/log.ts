import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (role: Discord.Role) => {
 const channels = await ch.getLogChannels('roleevents', role.guild);
 if (!channels) return;

 const language = await ch.getLanguage(role.guild.id);
 const lan = language.events.logs.role;
 const con = ch.constants.events.logs.role;
 const audit = role.tags?.botId ? undefined : await ch.getAudit(role.guild, 30, role.id);
 const auditUser =
  (role.tags?.botId ? await ch.getUser(role.tags.botId) : audit?.executor) ?? undefined;
 const files: Discord.AttachmentPayload[] = [];

 const embed: Discord.APIEmbed = {
  author: {
   icon_url: con.remove,
   name: lan.nameDelete,
  },
  description: auditUser ? lan.descDeleteAudit(auditUser, role) : lan.descDelete(role),
  fields: [],
  color: ch.constants.colors.danger,
  timestamp: new Date().toISOString(),
 };

 if (role.icon) {
  const attachments = (await ch.fileURL2Buffer([role.iconURL({ size: 4096 })])).filter(
   (e): e is Discord.AttachmentPayload => !!e,
  );

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
  color: ch.constants.colors.ephemeral,
  description: Object.entries(new Discord.PermissionsBitField(role.permissions).serialize(false))
   .map(
    ([name, value]) =>
     `${
      value
       ? ch.constants.standard.getEmote(ch.emotes.enabled)
       : ch.constants.standard.getEmote(ch.emotes.disabled)
     } \`${language.permissions.perms[name as keyof typeof language.permissions.perms]}\``,
   )
   .join('\n'),
 };

 ch.send({ id: channels, guildId: role.guild.id }, { embeds: [embed, permEmbed], files }, 10000);
};
