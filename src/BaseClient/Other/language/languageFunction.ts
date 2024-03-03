import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 getForumTag: (tag: Discord.GuildForumTag, emoji?: Discord.Emoji | string) =>
  `${emoji}${t.util.util.makeInlineCode(tag.name)} / ${t.util.util.makeInlineCode(tag.id)}${
   tag.moderated
    ? ` / ${t.util.constants.standard.getEmote(t.util.emotes.userFlags.DiscordEmployee)}`
    : ''
  }\n`,
 getGuild: (guild: Discord.Guild | Discord.APIPartialGuild | Discord.InviteGuild) =>
  `Server ${t.util.util.makeInlineCode(guild.name)} / ${t.util.util.makeInlineCode(guild.id)}${
   'vanityURLCode' in guild && guild.vanityURLCode
    ? ` / [${t.JSON.t.Join}](https://discord.gg/${guild.vanityURLCode})`
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
   ? `${type ?? t.JSON.t.Channel} <#${channel.id}> / ${t.util.util.makeInlineCode(
      'name' in channel
       ? `${channel.name}`
       : `<@${'recipientId' in channel ? channel.recipientId : null}>`,
     )} / ${t.util.util.makeInlineCode(channel.id)}\n`
   : t.channelTypes.unknownChannel,
 getUser: (
  user: Discord.User | { bot: boolean; id: string; username: string; discriminator: string },
 ) =>
  `${user?.bot ? t.JSON.t.Bot : t.JSON.t.User} <@${user?.id}> / ${t.util.util.makeInlineCode(
   user ? t.util.constants.standard.user(user) : t.JSON.t.Unknown,
  )} / ${t.util.util.makeInlineCode(user?.id)}\n`,
 getAutoModerationRule: (rule: Discord.AutoModerationRule) =>
  `${t.JSON.t.AutoModRule} ${t.util.util.makeInlineCode(rule.name)} / ${t.util.util.makeInlineCode(
   rule.id,
  )}\n`,
 getMessage: (msg: Discord.Message | Discord.MessageReference) =>
  `[${t.JSON.t.thisMessage}](${t.util.constants.standard.msgurl(
   msg.guildId,
   msg.channelId,
   'id' in msg ? msg.id : msg.messageId ?? '',
  )})\n`,
 getEmote: (emoji: Discord.Emoji) =>
  `${t.JSON.t.Emoji} ${t.util.constants.standard.getEmote(emoji)} / \`${
   emoji.name ?? t.JSON.t.None
  }\` / \`${emoji.id ?? t.JSON.t.None}\`\n`,
 getInvite: (invite: Discord.Invite) =>
  `${t.JSON.t.Invite} https://discord.gg/${invite.code} / \`${invite.code}\`\n`,
 getInviteDetails(invite: Discord.Invite, user?: Discord.User, channelType?: string) {
  return `${t.JSON.t.Code}: \`${invite.code}\`\n${
   user ? `${t.JSON.t.Inviter}: ${this.getUser(user)}` : ''
  }${t.JSON.t.Uses}: ${invite.uses}\n${t.JSON.t.Created}: ${
   invite.createdAt
    ? t.util.constants.standard.getTime(invite.createdAt.getTime())
    : t.JSON.t.Unknown
  }\n${this.getChannel(invite.channel, channelType)}`;
 },
 getIntegration: (integration: Discord.Integration) =>
  `${t.JSON.t.Integration} \`${integration.name}\` / \`${integration.id}\`\n`,
 getRole: (role: Discord.Role | { id: string; name: string }) =>
  `${t.JSON.t.Role} <@&${role.id}> / \`${role.name}\` / \`${role.id}\`\n`,
 getApplication: (application: Discord.Application | Discord.IntegrationApplication | bigint) =>
  `${t.JSON.t.Application} ${
   typeof application === 'bigint'
    ? `<@${application}> / \`${application}\``
    : `<@${application.id}> / \`${application.name}\` / \`${application.id}\`\n`
  }`,
 getScheduledEvent: (event: Discord.GuildScheduledEvent) =>
  `${t.JSON.t.ScheduledEvent} \`${event.name}\` / \`${event.id}\`\n`,
 getWebhook: (webhook: Discord.Webhook, type?: string) =>
  `${type ? `${type} ` : ''}${t.JSON.t.Webhook} \`${webhook.name}\` / \`${webhook.id}\`\n`,
 getCommand: (command: Discord.ApplicationCommand) =>
  `${t.JSON.t.Command} </${command.name}:${command.id}> / \`${command.name}\` / \`${command.id}\`\n`,
 getPunishment: (id: string, cId: string) =>
  `${t.JSON.t.Punishment} \`${Number(id).toString(36)}\`\n${t.util.stp(t.JSON.t.lookupPunishment, {
   cId,
  })}`,
 getSticker: (sticker: Discord.Sticker) =>
  `${t.JSON.t.Sticker} \`${sticker.name}\` / \`${sticker.id}\`\n`,
 getStageInstance(stageInstance: Discord.StageInstance) {
  return `${t.JSON.t.stageInstance} \`${stageInstance.topic}\` / \`${
   stageInstance.id
  }\`\n> ${this.getChannel(stageInstance.channel)}`;
 },
 getAuditLog: (audit: Discord.GuildAuditLogsEntry) =>
  `${t.JSON.t.auditLog} \`${t.auditLogAction[audit.action]}\` / \`${audit.id}\`\n`,
});
