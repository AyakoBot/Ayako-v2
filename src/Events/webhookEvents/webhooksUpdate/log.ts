import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';
import type CT from '../../../Typings/CustomTypings.js';

export default async (
  oldWebhook: Discord.Webhook,
  webhook: Discord.Webhook,
  channel: Discord.TextChannel | Discord.NewsChannel | Discord.VoiceChannel | Discord.ForumChannel,
) => {
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
    fields: [],
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

  if (oldWebhook?.avatar !== webhook?.avatar) {
    const getImage = async () => {
      if (!webhook?.avatar) {
        embed.fields?.push({ name: lan.avatar, value: lan.avatarRemoved });
        return;
      }

      const url = webhook.avatarURL({ size: 4096 });

      if (!url) {
        embed.fields?.push({ name: lan.avatar, value: lan.avatarRemoved });
        return;
      }

      const attachment = (await client.ch.fileURL2Buffer([url]))?.[0];

      merge(url, webhook.avatar, 'icon', lan.avatar);

      if (attachment) files.push(attachment);
    };

    getImage();
  }
  if (oldWebhook?.name !== webhook.name) {
    merge(oldWebhook?.name ?? language.unknown, webhook.name, 'string', language.name);
  }

  console.log(files);

  client.ch.send(
    { id: channels, guildId: channel.guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
