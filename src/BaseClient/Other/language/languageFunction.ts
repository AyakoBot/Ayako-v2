import * as Discord from 'discord.js';
import * as ch from '../../ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 getForumTag: (tag: Discord.GuildForumTag, emoji?: Discord.Emoji | string) =>
  `${emoji}${ch.util.makeInlineCode(tag.name)} / ${ch.util.makeInlineCode(tag.id)}${
   tag.moderated ? ` / ${ch.constants.standard.getEmote(ch.emotes.userFlags.DiscordEmployee)}` : ''
  }\n`,
 getGuild: (guild: Discord.Guild | Discord.APIPartialGuild | Discord.InviteGuild) =>
  `Server ${ch.util.makeInlineCode(guild.name)} / ${ch.util.makeInlineCode(guild.id)}${
   'vanityURLCode' in guild && guild.vanityURLCode
    ? ` / [${t.JSON.Join}](https://discord.gg/${guild.vanityURLCode})`
    : ''
  }\n`,
 getChannel: (
  channel:
   | Discord.Channel
   | Discord.GuildChannel
   | Discord.ThreadChannel
   | Discord.APIPartialChannel
   | { id: string; name: string }
   | undefined
   | null,
  type?: string,
 ) =>
  channel
   ? `${type ?? t.Channel} <#${channel.id}> / ${ch.util.makeInlineCode(
      'name' in channel
       ? `${channel.name}`
       : `<@${'recipientId' in channel ? channel.recipientId : null}>`,
     )} / ${ch.util.makeInlineCode(channel.id)}\n`
   : t.channelTypes.unknownChannel,
 getUser: (
  user: Discord.User | { bot: boolean; id: string; username: string; discriminator: string },
 ) =>
  `${user?.bot ? t.Bot : t.User} <@${user?.id}> / ${ch.util.makeInlineCode(
   user ? ch.constants.standard.user(user) : t.Unknown,
  )} / ${ch.util.makeInlineCode(user?.id)}\n`,
 getAutoModerationRule: (rule: Discord.AutoModerationRule) =>
  `${t.JSON.AutoModRule} ${ch.util.makeInlineCode(rule.name)} / ${ch.util.makeInlineCode(rule.id)}`,
 getMessage: (msg: Discord.Message | Discord.MessageReference) =>
  `[${t.JSON.thisMessage}](${ch.constants.standard.msgurl(
   msg.guildId,
   msg.channelId,
   'id' in msg ? msg.id : msg.messageId ?? '',
  )})\n`,
 getEmote: (emoji: Discord.Emoji) =>
  `${t.Emoji} ${ch.constants.standard.getEmote(emoji)} / \`${emoji.name ?? t.None}\` / \`${
   emoji.id ?? t.None
  }\`\n`,
 getInvite: (invite: Discord.Invite) =>
  `${t.Invite} https://discord.gg/${invite.code} / \`${invite.code}\`\n`,
 getInviteDetails(invite: Discord.Invite, user?: Discord.User, channelType?: string) {
  return `${t.JSON.Code}: \`${invite.code}\`\n${
   user ? `${t.JSON.Inviter}: ${this.getUser(user)}` : ''
  }${t.JSON.Uses}: ${invite.uses}\n${t.JSON.Created}: ${
   invite.createdAt ? ch.constants.standard.getTime(invite.createdAt.getTime()) : t.JSON.unknown
  }\n${this.getChannel(invite.channel, channelType)}`;
 },
 getIntegration: (integration: Discord.Integration) =>
  `${t.JSON.Integration} \`${integration.name}\` / \`${integration.id}\`\n`,
 getRole: (role: Discord.Role | { id: string; name: string }) =>
  `${t.Role} <@&${role.id}> / \`${role.name}\` / \`${role.id}\`\n`,
 getApplication: (application: Discord.Application | Discord.IntegrationApplication | bigint) =>
  `${t.Application} ${
   typeof application === 'bigint'
    ? `<@${application}> / \`${application}\``
    : `<@${application.id}> / \`${application.name}\` / \`${application.id}\`\n`
  }`,
 getScheduledEvent: (event: Discord.GuildScheduledEvent) =>
  `${t.ScheduledEvent} \`${event.name}\` / \`${event.id}\`\n`,
 getWebhook: (webhook: Discord.Webhook, type?: string) =>
  `${type ? `${type} ` : ''}${t.Webhook} \`${webhook.name}\` / \`${webhook.id}\`\n`,
 getCommand: (command: Discord.ApplicationCommand) =>
  `${t.Command} </${command.name}:${command.id}> / \`${command.name}\` / \`${command.id}\`\n`,
 getPunishment: (id: string, cId: string) =>
  `${t.Punishment} \`${Number(id).toString(36)}\`\n${ch.stp(t.JSON.lookupPunishment, {
   cId,
  })}`,
 getSticker: (sticker: Discord.Sticker) =>
  `${t.JSON.Sticker} \`${sticker.name}\` / \`${sticker.id}\`\n`,
 getStageInstance(stageInstance: Discord.StageInstance) {
  return `${t.JSON.stageInstance} \`${stageInstance.topic}\` / \`${
   stageInstance.id
  }\`\n> ${this.getChannel(stageInstance.channel)}`;
 },
 getAuditLog: (audit: Discord.GuildAuditLogsEntry) =>
  `${t.JSON.auditLog} \`${t.auditLogAction[audit.action]}\` / \`${audit.id}\`\n`,
});
