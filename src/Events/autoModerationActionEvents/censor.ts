import * as Discord from 'discord.js';
import Prisma from '@prisma/client';
import * as ch from '../../BaseClient/ClientHelper.js';
import { filtered_content as filterContent } from '../../../rust/rust.js';

export default async (msg: Discord.AutoModerationActionExecution) => {
 if (msg.action.type !== Discord.AutoModerationActionType.BlockMessage) return;

 const settings = await ch.DataBase.censor.findUnique({
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

 const content = await getContent(msg, settings);
 if (!content) return;

 ch.request.webhooks.execute(msg.guild, webhook.id, webhook.token, {
  username: msg.member?.displayName,
  avatar_url: msg.member?.displayAvatarURL() ?? msg.member?.user.displayAvatarURL(),
  content,
  thread_id: (msg.channel?.isThread() ? msg.channelId : undefined) ?? undefined,
 });
};

const getContent = async (msg: Discord.AutoModerationActionExecution, settings: Prisma.censor) => {
 const rules = (
  msg.guild.autoModerationRules.cache.size
   ? msg.guild.autoModerationRules.cache.map((r) => r)
   : await ch.request.guilds
      .getAutoModerationRules(msg.guild)
      .then((r) => ('message' in r ? [] : r))
      .catch(() => [])
 )
  .flat()
  .filter((r): r is Discord.AutoModerationRule => !!r)
  .filter((r) => r.eventType === Discord.AutoModerationRuleEventType.MessageSend)
  .filter((r) => (settings.repostrules?.length ? settings.repostrules?.includes(r.id) : true));

 if (!rules.length) return undefined;

 const presetRule = rules.find(
  (r) =>
   r.triggerMetadata.presets.length &&
   r.enabled &&
   r.actions.find((a) => a.type === Discord.AutoModerationActionType.BlockMessage),
 );

 const presetKeywords = presetRule
  ? await ch.DataBase.filterscraper.findMany({
     where: { filtertype: { in: presetRule.triggerMetadata.presets } },
    })
  : [];

 let content = String(msg.content);

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
      .map((k) =>
       k
        .replace(/\*/g, '')
        .replace(/[\\\\.\\+\\*\\?\\^\\$\\[\]\\(\\)\\{\\}\\/\\'\\#\\:\\!\\=\\|]/gi, '\\$&'),
      )
      .map((x) => `(\\w*${x}\\w*)`)
      .join('|'),
     'gi',
    ),
   )
   ?.filter((f) => f.length)
   ?.forEach((m) => {
    if (r.triggerMetadata.allowList.includes(m)) return;
    content = content.replace(new RegExp(m, 'g'), '[...]');
   });
 });

 if (msg.content === content) return undefined;

 content = content
  .replace(msg.matchedContent ?? '', msg.matchedContent ? '[...]' : '')
  .replace(msg.matchedKeyword ?? '', msg.matchedKeyword ? '[...]' : '');

 return content;
};

const getWebhook = async (msg: Discord.AutoModerationActionExecution) => {
 const channelOrThread = msg.channelId
  ? await ch.request.channels
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
  ch.error(msg.guild, new Error("Channel not found or can't fetched"));
  return undefined;
 }

 if (
  !msg.guild.members.me?.permissionsIn(channel.id).has(Discord.PermissionFlagsBits.ManageWebhooks)
 ) {
  ch.error(msg.guild, new Error('Insufficent Permissions to manage Webhooks'));
  return undefined;
 }

 return ch.getChannelWebhook(channel.id);
};
