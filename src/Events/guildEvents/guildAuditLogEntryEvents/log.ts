import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings.js';

export default async (log: Discord.GuildAuditLogsEntry, guild: Discord.Guild) => {
 const channels = await ch.getLogChannels('auditlogevents', guild);
 if (!channels) return;

 const language = await ch.languageSelector(guild.id);
 const lan = language.events.logs.guild;
 const con = ch.constants.events.logs.guild;

 const embeds: Discord.APIEmbed[] = [
  {
   author: {
    icon_url: con.AuditLogCreate,
    name: lan.auditCreate,
   },
   description: desc(log, lan),
   fields: [],
  },
  {
   title: lan.changes,
   color: ch.constants.colors.ephemeral,
  },
 ];

 const embed = embeds[0];
 const changesEmbed = embeds[1];

 if (log.reason) {
  embed.fields?.push({
   name: language.reason,
   value: log.reason,
  });
 }

 if (log.extra) {
  embed.fields?.push({
   name: language.Extra,
   value: `${log.extra}`,
  });
 }

 if (log.changes.length) {
  changesEmbed.description = `${log.changes.map(
   (c) =>
    `${ch.util.makeBold(`${getKey(c.key, log.action, guild, language)}`)}\n${ch.util.makeInlineCode(
     language.Before,
    )}${c.old ?? language.None}\n${ch.util.makeInlineCode(language.After)}${
     c.new ?? language.None
    }`,
  )}`;
 }

 embed.fields?.push({
  name: language.createdAt,
  value: ch.constants.standard.getTime(log.createdTimestamp),
 });

 ch.send({ id: channels, guildId: guild.id }, { embeds }, undefined, 10000);
};

const getKey = (
 key: string,
 type: Discord.AuditLogEvent,
 guild: Discord.Guild,
 language: CT.Language,
) => {
 switch (type) {
  case Discord.AuditLogEvent.ApplicationCommandPermissionUpdate: {
   const role = guild.roles.cache.get(key);
   if (role) return role;

   const channel = guild.channels.cache.get(key);
   if (channel) return channel;

   if (key.match(/^\d{17,19}$/)) return guild.members.cache.get(key) ?? key;

   return language.permissions.perms[key as Discord.PermissionsString];
  }
  default:
   return key;
 }
};

const desc = (log: Discord.GuildAuditLogsEntry, lan: CT.Language['events']['logs']['guild']) => {
 switch (log.targetType) {
  case 'Guild':
   return lan.descAuditLogCreateGuild(log, log.target as Discord.Guild);
  case 'Channel':
  case 'Thread':
   return lan.descAuditLogCreateChannel(log, log.target as Discord.GuildChannel);
  case 'User':
   return lan.descAuditLogCreateUser(log, log.target as Discord.User);
  case 'Role':
   return lan.descAuditLogCreateRole(log, log.target as Discord.Role);
  case 'Invite':
   return lan.descAuditLogCreateInvite(log, log.target as Discord.Invite);
  case 'Webhook':
   return lan.descAuditLogCreateWebhook(log, log.target as Discord.Webhook);
  case 'Emoji':
   return lan.descAuditLogCreateEmoji(log, log.target as Discord.GuildEmoji);
  case 'Message':
   return lan.descAuditLogCreateMessage(log, log.target as Discord.Message);
  case 'Integration':
   return lan.descAuditLogCreateIntegration(log, log.target as Discord.Integration);
  case 'StageInstance':
   return lan.descAuditLogCreateStageInstance(log, log.target as Discord.StageInstance);
  case 'Sticker':
   return lan.descAuditLogCreateSticker(log, log.target as Discord.Sticker);
  case 'GuildScheduledEvent':
   return lan.descAuditLogCreateGuildScheduledEvent(log, log.target as Discord.GuildScheduledEvent);
  case 'ApplicationCommand':
   return lan.descAuditLogCreateApplicationCommand(log, log.target as Discord.ApplicationCommand);
  case 'AutoModerationRule':
   return lan.descAuditLogCreateAutoModerationRule(log, log.target as Discord.AutoModerationRule);
  default:
   return lan.descAuditLogCreate(log);
 }
};
