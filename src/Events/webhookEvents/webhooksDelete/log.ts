import type * as Discord from 'discord.js';
import client from '../../../BaseClient/Client.js';

export default async (
  webhook: Discord.Webhook,
  channel: Discord.TextChannel | Discord.NewsChannel | Discord.VoiceChannel | Discord.ForumChannel,
) => {
  const channels = await client.ch.getLogChannels('webhookevents', channel.guild);
  if (!channels) return;

  const language = await client.ch.languageSelector(channel.guild.id);
  const lan = language.events.logs.webhook;
  const con = client.customConstants.events.logs.webhook;
  const audit = await client.ch.getAudit(channel.guild, 52, webhook.id);
  const auditUser = audit?.executor ?? undefined;
  const files: Discord.AttachmentPayload[] = [];

  const embed: Discord.APIEmbed = {
    author: {
      name: lan.nameDelete,
      icon_url: con.delete,
    },
    color: client.customConstants.colors.danger,
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

  if (webhook.sourceGuild) {
    embed.fields?.push({
      name: lan.sourceGuild,
      value: language.languageFunction.getGuild(webhook.sourceGuild),
    });
  }

  if (webhook.sourceChannel) {
    embed.fields?.push({
      name: lan.sourceChannel,
      value: language.languageFunction.getChannel(webhook.sourceChannel),
    });
  }

  client.ch.send(
    { id: channels, guildId: channel.guild.id },
    { embeds: [embed], files },
    language,
    undefined,
    10000,
  );
};
