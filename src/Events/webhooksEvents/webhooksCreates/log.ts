import type * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (webhook: Discord.Webhook, channel: Discord.GuildTextBasedChannel) => {
 const channels = await webhook.client.util.getLogChannels('webhookevents', channel.guild);
 if (!channels) return;

 const language = await webhook.client.util.getLanguage(channel.guild.id);
 const lan = language.events.logs.webhook;
 const con = webhook.client.util.constants.events.logs.webhook;
 const audit = await webhook.client.util.getAudit(channel.guild, 50, webhook.id);
 const auditUser =
  (webhook.owner ? await webhook.client.util.getUser(webhook.owner.id) : undefined) ??
  audit?.executor ??
  undefined;
 const files: Discord.AttachmentPayload[] = [];

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.nameCreate,
   icon_url: con.create,
  },
  color: CT.Colors.Success,
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
  timestamp: new Date().toISOString(),
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

 webhook.client.util.send(
  { id: channels, guildId: channel.guild.id },
  { embeds: [embed], files },
  10000,
 );
};
