import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import client from '../../../BaseClient/Client.js';

export default async (
  webhook: Discord.Webhook,
  channel: Discord.TextChannel | Discord.NewsChannel | Discord.VoiceChannel | Discord.ForumChannel,
) => {
  const channels = await ch.getLogChannels('webhookevents', channel.guild);
  if (!channels) return;

  const language = await ch.languageSelector(channel.guild.id);
  const lan = language.events.logs.webhook;
  const con = ch.constants.events.logs.webhook;
  const audit = await ch.getAudit(channel.guild, 50, webhook.id);
  const auditUser =
    (webhook.owner ? await client.users.fetch(webhook.owner.id) : undefined) ??
    audit?.executor ??
    undefined;
  const files: Discord.AttachmentPayload[] = [];

  const embed: Discord.APIEmbed = {
    author: {
      name: lan.nameCreate,
      icon_url: con.create,
    },
    color: ch.constants.colors.success,
    description: auditUser
      ? lan.descCreateAudit(
          webhook,
          lan.webhookTypes[webhook.type],
          auditUser,
          channel,
          language.channelTypes[channel.type],
        )
      : lan.descCreate(
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

  ch.send(
    { id: channels, guildId: channel.guild.id },
    { embeds: [embed], files },
    undefined,
    10000,
  );
};
