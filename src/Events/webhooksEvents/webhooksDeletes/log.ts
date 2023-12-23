import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/Typings.js';

export default async (webhook: Discord.Webhook, channel: Discord.GuildTextBasedChannel) => {
 const channels = await ch.getLogChannels('webhookevents', channel.guild);
 if (!channels) return;

 const language = await ch.getLanguage(channel.guild.id);
 const lan = language.events.logs.webhook;
 const con = ch.constants.events.logs.webhook;
 const audit = await ch.getAudit(channel.guild, 52, webhook.id);
 const auditUser = audit?.executor ?? undefined;
 const files: Discord.AttachmentPayload[] = [];

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.nameDelete,
   icon_url: con.delete,
  },
  color: CT.Colors.Danger,
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

 ch.send({ id: channels, guildId: channel.guild.id }, { embeds: [embed], files }, 10000);
};
