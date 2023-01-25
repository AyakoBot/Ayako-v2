import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';
import type CT from '../../../Typings/CustomTypings';

export default async (
  oldWebhook: Discord.Webhook | undefined,
  newWebhook: Discord.Webhook | undefined,
  channel: Discord.TextChannel | Discord.NewsChannel | Discord.VoiceChannel | Discord.ForumChannel,
) => {
  const webhook = oldWebhook ?? newWebhook;
  if (!webhook) return;

  const channels = await client.ch.getLogChannels('webhookevents', channel.guild);
  if (!channels) return;

  const language = await client.ch.languageSelector(channel.guild.id);
  const lan = language.events.logs.webhook;
  const con = client.customConstants.events.logs.webhook;
  const audit = await client.ch.getAudit(channel.guild, 51, webhook.id);
  const auditUser = audit?.executor ?? undefined;
  const files: Discord.AttachmentPayload[] = [];

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
    case oldWebhook?.avatar !== newWebhook?.avatar: {
      if (!newWebhook?.avatar) {
        embed.fields?.push({ name: lan.avatar, value: lan.avatarRemoved });
        break;
      }

      const url = webhook.avatarURL({ size: 4096 });

      if (!url) {
        embed.fields?.push({ name: lan.avatar, value: lan.avatarRemoved });
        break;
      }

      const attachment = (await client.ch.fileURL2Buffer([url]))?.[0]?.attachment;

      merge(url, webhook.avatar, 'icon', lan.avatar);

      if (attachment) {
        files.push({
          name: client.ch.getNameAndFileType(url),
          attachment,
        });

        embed.thumbnail = {
          url: `attachment://${client.ch.getNameAndFileType(url)}`,
        };
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
    { id: channels, guildId: channel.guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
