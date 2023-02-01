import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (invite: Discord.Invite, guild: Discord.Guild) => {
  const channels = await client.ch.getLogChannels('inviteevents', guild);
  if (!channels) return;

  const language = await client.ch.languageSelector(guild.id);
  const lan = language.events.logs.invite;
  const con = client.customConstants.events.logs.invite;
  const audit = await client.ch.getAudit(guild, 40, invite.code);
  const auditUser = audit?.executor ?? invite.inviter ?? undefined;

  const embed: Discord.APIEmbed = {
    author: {
      icon_url: con.create,
      name: lan.nameCreate,
    },
    description: auditUser ? lan.descCreateAudit(auditUser, invite) : lan.descCreate(invite),
    fields: [],
    color: client.customConstants.colors.success,
  };

  const flagsText = [invite.temporary ? lan.temporary : null]
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
      inline: false,
    });
  }

  if (invite.targetUser) {
    embed.fields?.push({
      name: lan.targetUser,
      value: language.languageFunction.getUser(invite.targetUser),
      inline: false,
    });
  }

  if (invite.targetApplication) {
    embed.fields?.push({
      name: language.Application,
      value: language.languageFunction.getApplication(invite.targetApplication),
    });
  }

  if (invite.expiresAt) {
    embed.fields?.push({
      name: lan.expiresAt,
      value: client.customConstants.standard.getTime(invite.expiresAt.getTime()),
    });
  }

  const channel = invite.channelId ? client.channels.cache.get(invite.channelId) : undefined;

  if (channel) {
    embed.fields?.push({
      name: language.Channel,
      value: language.languageFunction.getChannel(channel, language.channelTypes[channel.type]),
      inline: false,
    });
  }

  if (invite.guildScheduledEvent) {
    embed.fields?.push({
      name: language.ScheduledEvent,
      value: language.languageFunction.getScheduledEvent(invite.guildScheduledEvent),
      inline: false,
    });
  }

  if (invite.maxAge) {
    embed.fields?.push({
      name: lan.maxAge,
      value: client.ch.moment(invite.maxAge, language),
    });
  }

  if (invite.createdAt) {
    embed.fields?.push({
      name: language.createdAt,
      value: client.customConstants.standard.getTime(invite.createdAt.getTime()),
    });
  }

  if (invite.targetType) {
    embed.fields?.push({
      name: lan.targetTypeName,
      value: lan.targetType[invite.targetType],
    });
  }

  embed.fields?.push({
    name: lan.maxUses,
    value: String(invite.maxUses || '∞'),
  });

  client.ch.send(
    { id: channels, guildId: guild.id },
    { embeds: [embed] },
    language,
    undefined,
    10000,
  );
};
