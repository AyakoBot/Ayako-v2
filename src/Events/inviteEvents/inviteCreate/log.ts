import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (invite: DDeno.BaseInvite, guild: DDeno.Guild, inv: DDeno.Invite) => {
  const channels = await client.ch.getLogChannels('guildevents', { guildId: guild.id });
  if (!channels) return;

  const language = await client.ch.languageSelector(invite.guild.id);
  const lan = language.events.logs.invite;
  const con = client.customConstants.events.logs.invite;
  const audit = await client.ch.getAudit(
    guild,
    40,
    undefined,
    (i: DDeno.AuditLogEntry) => i.changes?.find((c) => c.key === 'code')?.new === invite.code,
  );
  const auditUser =
    audit && audit.userId ? await client.users.fetch(audit.userId) : undefined;

  const embed: Discord.APIEmbed = {
    author: {
      icon_url: con.create,
      name: lan.nameCreate,
    },
    description: auditUser ? lan.descCreateAudit(auditUser, inv) : lan.descCreate(inv),
    fields: [],
    color: client.customConstants.colors.success,
  };

  const flagsText = [inv.temporary ? lan.temporary : null]
    .filter((f): f is string => !!f)
    .map((f) => `\`${f}\``)
    .join(', ');

  if (flagsText) {
    embed.fields?.push({
      name: lan.flagsName,
      value: flagsText,
      inline: true,
    });
  }

  if (invite.inviter) {
    embed.fields?.push({
      name: lan.inviter,
      value: language.languageFunction.getUser(invite.inviter),
    });
  }

  if (invite.targetUser) {
    embed.fields?.push({
      name: lan.targetUser,
      value: language.languageFunction.getUser(invite.targetUser),
    });
  }

  if (inv.targetApplication) {
    embed.fields?.push({
      name: language.Application,
      value: language.languageFunction.getApplication(inv.targetApplication),
    });
  }

  if (invite.expiresAt) {
    embed.fields?.push({
      name: lan.expiresAt,
      value: client.customConstants.standard.getTime(invite.expiresAt),
    });
  }

  const channel = await client.ch.cache.channels.get(inv.channelId, guild.id);

  if (channel) {
    embed.fields?.push({
      name: language.Channel,
      value: language.languageFunction.getChannel(channel, language.channelTypes[channel.type]),
    });
  }

  if (invite.guildScheduledEvent) {
    embed.fields?.push({
      name: language.ScheduledEvent,
      value: language.languageFunction.getScheduledEvent(invite.guildScheduledEvent),
    });
  }

  embed.fields?.push(
    {
      name: language.createdAt,
      value: client.customConstants.standard.getTime(inv.createdAt),
    },
    {
      name: lan.targetTypeName,
      value: lan.targetType[inv.targetType],
    },
    {
      name: lan.maxAge,
      value: client.ch.moment(inv.maxAge, language),
    },
    {
      name: lan.maxUses,
      value: String(inv.maxUses) ?? '∞',
    },
  );

  client.ch.send(
    { id: channels, guildId: guild.id },
    { embeds: [embed] },
    language,
    undefined,
    10000,
  );
};
