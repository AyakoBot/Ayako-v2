import Prisma from '@prisma/client';
import * as Discord from 'discord.js';
import { filtered_content as filterContent } from '../../../../rust/rust.js';

export default async (msg: Discord.AutoModerationActionExecution) => {
 if (msg.action.type !== Discord.AutoModerationActionType.BlockMessage) return;

 const settings = await msg.guild.client.util.DataBase.censor.findUnique({
  where: { guildid: msg.guild.id, active: true },
 });
 if (!settings) return;

 reposter(msg, settings);
};

const reposter = async (msg: Discord.AutoModerationActionExecution, settings: Prisma.censor) => {
 if (
  settings.repostroles.length &&
  !settings.repostroles?.some((r) => msg.member?.roles.cache.has(r))
 ) {
  return;
 }
 if (!msg.matchedContent && !msg.matchedKeyword) return;

 const webhook = await getWebhook(msg);
 if (!webhook || !webhook.token) return;

 const content = await getContent(msg.guild, msg.content, settings, msg);
 if (msg.content === content) return;

 msg.guild.client.util.request.webhooks.execute(msg.guild, webhook.id, webhook.token, {
  username: msg.member?.displayName,
  avatar_url: msg.member?.displayAvatarURL() ?? msg.member?.user.displayAvatarURL(),
  content,
  thread_id: (msg.channel?.isThread() ? msg.channelId : undefined) ?? undefined,
 });
};

export const getContent = async (
 guild: Discord.Guild,
 rawContent: string,
 settings?: Prisma.censor,
 msg?: Discord.AutoModerationActionExecution,
 channel?: Discord.GuildBasedChannel,
) => {
 const rules = (
  guild.autoModerationRules.cache.size
   ? guild.autoModerationRules.cache.map((r) => r)
   : await guild.client.util.request.guilds
      .getAutoModerationRules(guild)
      .then((r) => ('message' in r ? [] : r))
      .catch(() => [])
 )
  .flat()
  .filter((r): r is Discord.AutoModerationRule => !!r)
  .filter((r) => r.eventType === Discord.AutoModerationRuleEventType.MessageSend)
  .filter((r) => (settings?.repostrules?.length ? settings.repostrules?.includes(r.id) : true))
  .filter((r) => {
   if (!r.exemptChannels.size) return true;

   const includesChannel = channel ? r.exemptChannels.has(channel.id) : false;
   const includesParent = channel?.parentId ? r.exemptChannels.has(channel.parentId) : false;

   if (includesChannel || includesParent) return false;
   if (
    !channel &&
    r.exemptChannels.hasAny(guild.rulesChannelId ?? '', guild.rulesChannel?.parentId ?? '')
   ) {
    return false;
   }
   return true;
  });

 if (!rules.length) return rawContent;

 const presetRule = rules.find(
  (r) =>
   r.triggerMetadata.presets.length &&
   r.enabled &&
   r.actions.find((a) => a.type === Discord.AutoModerationActionType.BlockMessage),
 );

 const presetKeywords = presetRule
  ? await guild.client.util.DataBase.filterscraper.findMany({
     where: { filtertype: { in: presetRule.triggerMetadata.presets } },
    })
  : [];

 let content = String(rawContent);

 presetKeywords?.forEach((p) => {
  content = content.replace(new RegExp(p.keyword, 'g'), '[...]');
 });

 rules.forEach((r) => {
  if (!r.enabled) return;

  if (r.triggerMetadata.regexPatterns) {
   content = filterContent(r.triggerMetadata.regexPatterns, content);
  }

  content
   .match(
    new RegExp(
     r.triggerMetadata.keywordFilter
      .map((k) => k.replace(/[\\\\.\\+\\?\\^\\$\\[\]\\(\\)\\{\\}\\/\\'\\#\\:\\!\\=\\|]/gi, '\\$&'))
      .map((k) => (k.startsWith('*') ? `\\w*${k.slice(1, k.length)}` : `(\\s|^)${k}`))
      .map((k) => (k.endsWith('*') ? `${k.slice(0, k.length - 1)}\\w*` : `${k}(\\s|$)`))
      .map(
       (k) =>
        `(${k.startsWith('(\\s|^)') ? '' : '\\w*'}${k}${k.endsWith('(\\s|$)') ? '' : '\\w*'})`,
      )
      .join('|'),
     'gi',
    ),
   )
   ?.filter((m) => m.length)
   ?.map((m) => m.trim())
   ?.forEach((m) => {
    if (r.triggerMetadata.allowList.includes(m)) return;
    content = content.replace(new RegExp(m, 'g'), '[...]');
   });
 });

 if (rawContent === content) return rawContent;

 content = msg
  ? content
     .replace(msg.matchedContent ?? '', msg.matchedContent ? '[...]' : '')
     .replace(msg.matchedKeyword ?? '', msg.matchedKeyword ? '[...]' : '')
  : content;

 return content;
};

const getWebhook = async (msg: Discord.AutoModerationActionExecution) => {
 const channelOrThread = msg.channelId
  ? await msg.guild.client.util.request.channels
     .get(msg.guild, msg.channelId)
     .then((r) => ('message' in r ? undefined : r))
  : undefined;
 const isThread = channelOrThread
  ? [
     Discord.ChannelType.PublicThread,
     Discord.ChannelType.PrivateThread,
     Discord.ChannelType.AnnouncementThread,
    ].includes(channelOrThread?.type)
  : false;

 const channel =
  isThread && channelOrThread
   ? msg.guild.channels.cache.get((channelOrThread as Discord.ThreadChannel).parentId as string)
   : channelOrThread;

 if (!channel) {
  msg.guild.client.util.error(msg.guild, new Error("Channel not found or can't fetched"));
  return undefined;
 }

 if (
  !(await msg.guild.client.util.getBotMemberFromGuild(msg.guild))
   ?.permissionsIn(channel.id)
   .has(Discord.PermissionFlagsBits.ManageWebhooks)
 ) {
  msg.guild.client.util.error(msg.guild, new Error('Insufficent Permissions to manage Webhooks'));
  return undefined;
 }

 return msg.guild.client.util.getChannelWebhook(channel.id);
};
