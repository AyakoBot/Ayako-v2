import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import type CT from '../../../Typings/CustomTypings.js';

export default async (
 oldWebhook: Discord.Webhook,
 webhook: Discord.Webhook,
 channel: Discord.TextChannel | Discord.NewsChannel | Discord.VoiceChannel | Discord.ForumChannel,
) => {
 const channels = await ch.getLogChannels('webhookevents', channel.guild);
 if (!channels) return;

 const language = await ch.getLanguage(channel.guild.id);
 const lan = language.events.logs.webhook;
 const con = ch.constants.events.logs.webhook;
 const audit = await ch.getAudit(channel.guild, 51, webhook.id);
 const auditUser = audit?.executor ?? undefined;
 const files: Discord.AttachmentPayload[] = [];

 const embed: Discord.APIEmbed = {
  author: {
   name: lan.nameUpdate,
   icon_url: con.update,
  },
  color: ch.constants.colors.loading,
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
  ch.mergeLogging(before, after, type, embed, language, name);

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

   const attachment = (await ch.fileURL2Buffer([url]))?.[0];

   merge(url, ch.getNameAndFileType(url), 'icon', lan.avatar);

   if (attachment) files.push(attachment);
  };

  await getImage();
 }
 if (oldWebhook?.name !== webhook.name) {
  merge(oldWebhook?.name ?? language.t.unknown, webhook.name, 'string', language.t.name);
 }
 if (oldWebhook.channel?.id !== webhook.channel?.id) {
  merge(
   oldWebhook.channel
    ? language.languageFunction.getChannel(
       oldWebhook.channel,
       language.channelTypes[oldWebhook.channel.type],
      )
    : language.t.unknown,

   language.languageFunction.getChannel(channel, language.channelTypes[channel.type]),
   'string',
   language.t.Channel,
  );
 }

 ch.send({ id: channels, guildId: channel.guild.id }, { embeds: [embed], files }, 10000);
};
