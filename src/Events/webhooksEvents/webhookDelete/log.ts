import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (webhook: DDeno.Webhook) => {
  if (!webhook.guildId) return;
  if (!webhook.channelId) return;

  const channels = await client.ch.getLogChannels('webhookevents', { guildId: webhook.guildId });
  if (!channels) return;

  const channel = await client.ch.cache.channels.get(webhook.channelId, webhook.guildId);
  if (!channel) return;

  const guild = await client.ch.cache.guilds.get(webhook.guildId);
  if (!guild) return;

  const language = await client.ch.languageSelector(webhook.guildId);
  const lan = language.events.logs.webhook;
  const con = client.customConstants.events.logs.webhook;
  const audit = await client.ch.getAudit(guild, 52, webhook.id);
  const auditUser =
    audit && audit.userId ? await client.ch.cache.users.get(audit.userId) : undefined;
  const files: DDeno.FileContent[] = [];

  const embed: DDeno.Embed = {
    author: {
      name: lan.nameDelete,
      iconUrl: con.delete,
    },
    color: client.customConstants.colors.warning,
    description: auditUser
      ? lan.descDeleteAudit(
          webhook,
          lan.webhookTypes[webhook.type],
          auditUser,
          channel,
          language.channelTypes[channel.type],
        )
      : lan.descDelete(
          webhook,
          lan.webhookTypes[webhook.type],
          channel,
          language.channelTypes[channel.type],
        ),
  };

  if (webhook.avatar) {
    const url = client.customConstants.standard.userAvatarURL(webhook, 'png');
    const blob = (await client.ch.fileURL2Blob([url]))?.[0]?.blob;

    if (blob) {
      files.push({
        name: String(webhook.avatar),
        blob,
      });
    }
  }

  if (webhook.sourceGuild) {
    embed.fields?.push({
      name: lan.sourceGuild,
      value: language.languageFunction.getGuild(webhook.sourceGuild as DDeno.Guild),
    });
  }

  if (webhook.sourceChannel) {
    embed.fields?.push({
      name: lan.sourceChannel,
      value: language.languageFunction.getChannel(webhook.sourceChannel as DDeno.Channel),
    });
  }

  client.ch.send(
    { id: channels, guildId: webhook.guildId },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
