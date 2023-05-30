import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import type CT from '../../../Typings/CustomTypings.js';

export default async (
 oldRule: Discord.AutoModerationRule | undefined,
 rule: Discord.AutoModerationRule,
) => {
 const channels = await ch.getLogChannels('automodevents', rule.guild);
 if (!channels) return;

 const language = await ch.languageSelector(rule.guild.id);
 const lan = language.events.logs.automodRule;
 const con = ch.constants.events.logs.automodRule;
 const user = await ch.getUser(rule.creatorId);
 if (!user) return;

 const embed: Discord.APIEmbed = {
  author: {
   icon_url: con.update,
   name: lan.nameUpdate,
  },
  description: lan.descUpdate(user, rule),
  fields: [],
  color: ch.constants.colors.loading,
  timestamp: new Date().toISOString(),
 };

 const merge = (before: unknown, after: unknown, type: CT.AcceptedMergingTypes, name: string) =>
  ch.mergeLogging(before, after, type, embed, language, name);

 if (rule.name !== oldRule?.name) {
  merge(oldRule ? oldRule.name : language.unknown, rule.name, 'string', language.name);
 }
 if (oldRule && rule.enabled !== oldRule?.enabled) {
  merge(oldRule?.enabled, rule.enabled, 'boolean', lan.enabled);
 }
 if (rule.eventType !== oldRule?.eventType) {
  merge(
   oldRule?.eventType ? lan.eventType[oldRule.eventType] : language.unknown,
   lan.eventType[rule.eventType],
   'string',
   lan.eventTypeName,
  );
 }
 if (rule.triggerType !== oldRule?.triggerType) {
  merge(
   oldRule?.triggerType ? lan.triggerType[oldRule?.triggerType] : language.unknown,
   lan.triggerType[rule.triggerType],
   'string',
   lan.triggerTypeName,
  );
 }
 if (
  rule.triggerMetadata &&
  oldRule?.triggerMetadata &&
  rule.triggerMetadata?.mentionTotalLimit !== oldRule?.triggerMetadata?.mentionTotalLimit
 ) {
  merge(
   oldRule ? oldRule?.triggerMetadata?.mentionTotalLimit : language.unknown,
   rule.triggerMetadata?.mentionTotalLimit ?? language.None,
   'string',
   lan.mentionTotalLimit,
  );
 }
 if (
  oldRule &&
  JSON.stringify(rule.exemptRoles.map((r) => r.id)) !==
   JSON.stringify(oldRule?.exemptRoles.map((r) => r.id))
 ) {
  merge(
   ch
    .getDifference(
     rule.exemptRoles.map((r) => r.id),
     oldRule?.exemptRoles.map((r) => r.id) ?? [],
    )
    .map((r) => `<@&${r}>`)
    .join(', '),
   ch
    .getDifference(
     oldRule?.exemptRoles.map((r) => r.id) ?? [],
     rule.exemptRoles.map((r) => r.id),
    )
    .map((r) => `<@&${r}>`)
    .join(', '),
   'difference',
   lan.exemptRoles,
  );
 }
 if (
  oldRule &&
  JSON.stringify(rule.exemptChannels.map((r) => r.id)) !==
   JSON.stringify(oldRule?.exemptChannels.map((r) => r.id))
 ) {
  const beforeContent = ch
   .getDifference(
    rule.exemptChannels.map((r) => r.id),
    oldRule?.exemptChannels.map((r) => r.id) ?? [],
   )
   .map((r) => `<#${r}>`)
   .join(', ');
  const afterContent = ch
   .getDifference(
    oldRule?.exemptChannels.map((r) => r.id) ?? [],
    rule.exemptChannels.map((r) => r.id),
   )
   .map((r) => `<#${r}>`)
   .join(', ');

  merge(
   beforeContent?.length ? beforeContent : language.None,
   afterContent?.length ? afterContent : language.None,
   'difference',
   lan.exemptChannels,
  );
 }
 if (
  oldRule &&
  JSON.stringify(rule.triggerMetadata?.keywordFilter) !==
   JSON.stringify(oldRule?.triggerMetadata?.keywordFilter)
 ) {
  const beforeContent = ch
   .getDifference(
    rule.triggerMetadata?.keywordFilter ?? [],
    oldRule?.triggerMetadata?.keywordFilter ?? [],
   )
   .map((r) => `\`${r}\``)
   .join(', ');

  const afterContent = ch
   .getDifference(
    oldRule?.triggerMetadata?.keywordFilter ?? [],
    rule.triggerMetadata?.keywordFilter ?? [],
   )
   .map((r) => `\`${r}\``)
   .join(', ');

  merge(
   beforeContent.length ? beforeContent : language.None,
   afterContent.length ? afterContent : language.None,
   'difference',
   lan.keywordFilter,
  );
 }
 if (
  oldRule &&
  JSON.stringify(rule.triggerMetadata?.presets) !==
   JSON.stringify(oldRule?.triggerMetadata?.presets)
 ) {
  const beforeContent = ch
   .getDifference(rule.triggerMetadata?.presets ?? [], oldRule?.triggerMetadata?.presets ?? [])
   .map((r) => `\`${lan.presets[r as keyof typeof lan.presets]}\``)
   .join(', ');

  const afterContent = ch
   .getDifference(oldRule?.triggerMetadata?.presets ?? [], rule.triggerMetadata?.presets ?? [])
   .map((r) => `\`${lan.presets[r as keyof typeof lan.presets]}\``)
   .join(', ');

  merge(
   beforeContent.length ? beforeContent : language.None,
   afterContent.length ? afterContent : language.None,
   'difference',
   lan.presetsName,
  );
 }
 if (
  oldRule &&
  JSON.stringify(rule.triggerMetadata?.allowList) !==
   JSON.stringify(oldRule?.triggerMetadata?.allowList)
 ) {
  const beforeContent = ch
   .getDifference(rule.triggerMetadata?.allowList ?? [], oldRule?.triggerMetadata?.allowList ?? [])
   .map((r) => `\`${r}\``)
   .join(', ');

  const afterContent = ch
   .getDifference(oldRule?.triggerMetadata?.allowList ?? [], rule.triggerMetadata?.allowList ?? [])
   .map((r) => `\`${r}\``)
   .join(', ');

  merge(
   beforeContent.length ? beforeContent : language.None,
   afterContent.length ? afterContent : language.None,
   'difference',
   lan.allowList,
  );
 }
 if (
  oldRule &&
  JSON.stringify(rule.triggerMetadata?.regexPatterns) !==
   JSON.stringify(oldRule?.triggerMetadata?.regexPatterns)
 ) {
  const beforeContent = ch
   .getDifference(
    rule.triggerMetadata?.regexPatterns ?? [],
    oldRule?.triggerMetadata?.regexPatterns ?? [],
   )
   .map((r) => `\`${r}\``)
   .join(', ');

  const afterContent = ch
   .getDifference(
    oldRule?.triggerMetadata?.regexPatterns ?? [],
    rule.triggerMetadata?.regexPatterns ?? [],
   )
   .map((r) => `\`${r}\``)
   .join(', ');

  merge(
   beforeContent.length ? beforeContent : language.None,
   afterContent.length ? afterContent : language.None,
   'difference',
   lan.regexPatterns,
  );
 }
 if (JSON.stringify(rule.actions) !== JSON.stringify(oldRule?.actions)) {
  const addedActions = rule.actions.filter(
   (a) => !oldRule?.actions.find((a2) => a2.type === a.type),
  );
  const removedActions = oldRule?.actions.filter(
   (a) => !rule.actions.find((a2) => a2.type === a.type),
  );
  const changedActions = (
   ch.getChanged(
    rule.actions as unknown as Record<string, unknown>[],
    (oldRule?.actions ?? []) as unknown as Record<string, unknown>[],
    'id',
   ) as unknown as Discord.AutoModerationRule['actions']
  ).filter(
   (a) =>
    !addedActions.find((a2) => a2.type === a.type) &&
    !removedActions?.find((a2) => a2.type === a.type),
  );

  const addedChannels = await Promise.all(
   addedActions.map((a) =>
    a?.metadata?.channelId ? ch.getChannel.guildTextChannel(a.metadata.channelId) : undefined,
   ),
  );
  const removedChannels = removedActions
   ? await Promise.all(
      removedActions.map((a) =>
       a?.metadata?.channelId ? ch.getChannel.guildTextChannel(a.metadata.channelId) : undefined,
      ),
     )
   : [];

  const getActionContent = (
   array: Discord.AutoModerationRule['actions'],
   channel: (
    | Discord.PrivateThreadChannel
    | Discord.PublicThreadChannel<boolean>
    | Discord.NewsChannel
    | Discord.TextChannel
    | Discord.VoiceChannel
    | undefined
   )[],
  ) =>
   array
    .map(
     (action, i) =>
      `${lan.actionsTypeName}: \`${lan.actionsType[action.type]}\`${
       action.type !== 1
        ? ` - ${
           action.type === 2
            ? `${lan.alertChannel} <#${action.metadata.channelId}>  / \`${channel[i]?.name}\` / \`${action.metadata?.channelId}\``
            : `${lan.timeoutDuration} \`${ch.moment(
               action.metadata?.durationSeconds
                ? Number(action.metadata.durationSeconds) * 1000
                : 0,
               language,
              )}\``
          }`
        : ''
      }`,
    )
    .join('\n');

  const addedContent = getActionContent(
   addedActions.filter((a): a is Discord.AutoModerationAction => !!a),
   addedChannels,
  );
  const removedContent = removedActions
   ? getActionContent(
      removedActions.filter((a): a is Discord.AutoModerationAction => !!a),
      removedChannels,
     )
   : undefined;

  const before =
   changedActions
    .map((a) => oldRule?.actions.find((a2) => a.type === a2.type))
    .filter((a): a is Discord.AutoModerationAction => !!a) ?? [];

  const after =
   changedActions
    .map((a) => rule.actions.find((a2) => a.type === a2.type))
    .filter((a): a is Discord.AutoModerationAction => !!a) ?? [];

  const { beforeContent, afterContent } = {
   beforeContent: getActionContent(
    before,
    await Promise.all(
     before.map((a) =>
      a?.metadata?.channelId ? ch.getChannel.guildTextChannel(a.metadata.channelId) : undefined,
     ),
    ),
   ),
   afterContent: getActionContent(
    after,
    await Promise.all(
     after.map((a) =>
      a?.metadata?.channelId ? ch.getChannel.guildTextChannel(a.metadata.channelId) : undefined,
     ),
    ),
   ),
  };

  if (addedContent) {
   embed.fields?.push({ name: lan.addedActions, value: addedContent, inline: false });
  }

  if (removedContent) {
   embed.fields?.push({ name: lan.removedActions, value: removedContent, inline: false });
  }

  if (beforeContent || afterContent) {
   merge(beforeContent, afterContent, 'string', lan.changedActions);
  }
 }

 if (!embed.fields?.length) return;

 ch.send({ id: channels, guildId: rule.guild.id }, { embeds: [embed] }, undefined, 10000);
};
