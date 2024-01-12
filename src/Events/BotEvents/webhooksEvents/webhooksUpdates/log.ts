import type * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

export default async (
 oldWebhook: Discord.Webhook,
 webhook: Discord.Webhook,
 channel: Discord.GuildTextBasedChannel,
) => {
 const channels = await webhook.client.util.getLogChannels('webhookevents', channel.guild);
 if (!channels) return;

 const language = await webhook.client.util.getLanguage(channel.guild.id);
 const lan = language.events.logs.webhook;
 const con = webhook.client.util.constants.events.logs.webhook;
 const audit = await webhook.client.util.getAudit(channel.guild, 51, webhook.id);
 const auditUser = audit?.executor ?? undefined;
 const files: Discord.AttachmentPayload[] = [];

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.nameUpdate,
   icon_url: con.update,
  },
  color: CT.Colors.Loading,
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
  timestamp: new Date().toISOString(),
 };

 const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
  webhook.client.util.mergeLogging(before, after, type, embed, language, name);

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

   const attachment = (await webhook.client.util.fileURL2Buffer([url]))?.[0];

   merge(url, webhook.client.util.getNameAndFileType(url), 'icon', lan.avatar);

   if (attachment) files.push(attachment);
  };

  await getImage();
 }
 if (oldWebhook?.name !== webhook.name) {
  merge(oldWebhook?.name ?? language.t.Unknown, webhook.name, 'string', language.t.name);
 }
 if (oldWebhook.channel?.id !== webhook.channel?.id) {
  merge(
   oldWebhook.channel
    ? language.languageFunction.getChannel(
       oldWebhook.channel,
       language.channelTypes[oldWebhook.channel.type],
      )
    : language.t.Unknown,

   language.languageFunction.getChannel(channel, language.channelTypes[channel.type]),
   'string',
   language.t.Channel,
  );
 }

 webhook.client.util.send(
  { id: channels, guildId: channel.guild.id },
  { embeds: [embed], files },
  10000,
 );
};
