import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';
import type CT from '../../../Typings/CustomTypings';

export default async (oldWebhook: DDeno.Webhook | undefined, webhook: DDeno.Webhook) => {
  if (!webhook.guild.id) return;
  if (!webhook.channelId) return;

  const channels = await client.ch.getLogChannels('webhookevents', { guildId: webhook.guild.id });
  if (!channels) return;

  const channel = await client.ch.cache.channels.get(webhook.channelId, webhook.guild.id);
  if (!channel) return;

  const guild = await client.ch.cache.guilds.get(webhook.guild.id);
  if (!guild) return;

  const language = await client.ch.languageSelector(webhook.guild.id);
  const lan = language.events.logs.webhook;
  const con = client.customConstants.events.logs.webhook;
  const audit = await client.ch.getAudit(guild, 51, webhook.id);
  const auditUser =
    audit && audit.userId ? await client.users.fetch(audit.userId) : undefined;
  const files: DDeno.FileContent[] = [];

  const embed: Discord.APIEmbed = {
    author: {
      name: lan.nameUpdate,
      icon_url: con.update,
    },
    color: client.customConstants.colors.loading,
    description: auditUser
      ? lan.descUpdateAudit(
          webhook,
          lan.webhookTypes[webhook.type],
          auditUser,
          channel,
          language.channelTypes[channel.type],
        )
      : lan.descUpdate(
          webhook,
          lan.webhookTypes[webhook.type],
          channel,
          language.channelTypes[channel.type],
        ),
  };

  const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
    client.ch.mergeLogging(before, after, type, embed, language, name);

  switch (true) {
    case oldWebhook?.avatar !== webhook.avatar: {
      if (webhook.avatar) {
        const url = client.customConstants.standard.userAvatarURL(webhook, 'png');
        const blob = (await client.ch.fileURL2Buffer([url]))?.[0]?.blob;

        if (blob) {
          files.push({
            name: String(webhook.avatar),
            blob,
          });
        }

        merge(url, webhook.avatar, 'icon', lan.avatar);
      }
      break;
    }
    case oldWebhook?.name !== webhook.name: {
      merge(oldWebhook?.name ?? language.unknown, webhook.name, 'string', language.name);
      break;
    }
    default: {
      return;
    }
  }

  client.ch.send(
    { id: channels, guildId: webhook.guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
