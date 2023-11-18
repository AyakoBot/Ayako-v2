import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';
import SH from '../../../../BaseClient/ClientHelperModules/settingsHelpers.js';

const name = 'blacklist-rules';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guild?.id);
 const lan = language.slashCommands.settings.categories[name];

 const ID = cmd.options.get('id', false)?.value as string;
 if (ID) {
  showID(cmd, ID, language, lan);
  return;
 }
 showAll(cmd, language, lan);
};

export const showID: NonNullable<CT.SettingsFile<typeof name>['showID']> = async (
 cmd,
 ID,
 language,
 lan,
) => {
 const { embedParsers } = ch.settingsHelpers;
 const automodRule = cmd.guild?.autoModerationRules.cache.get(ID);

 if (!automodRule) {
  ch.errorCmd(cmd, language.errors.automodRuleNotFound, language);
  return;
 }

 if (cmd.isButton()) {
  cmd.update({
   embeds: getEmbeds(embedParsers, automodRule, language, lan),
   components: getComponents(automodRule, language, lan),
  });
  return;
 }

 cmd.reply({
  embeds: getEmbeds(embedParsers, automodRule, language, lan),
  components: getComponents(automodRule, language, lan),
  ephemeral: true,
 });
};

export const showAll: NonNullable<CT.SettingsFile<typeof name>['showAll']> = async (
 cmd,
 language,
 lan,
) => {
 const { multiRowHelpers } = ch.settingsHelpers;

 const automodRules = cmd.guild?.autoModerationRules.cache.map((o) => o);

 const fields = automodRules?.map((r) => ({
  name: `${language.name}: \`${r.name}\` - ${language.events.logs.automodRule.actions}: ${
   r.actions.length
    ? r.actions
       .map((a) => ch.util.makeInlineCode(language.events.logs.automodRule.actionsType[a.type]))
       .join(', ')
    : language.None
  }`,
  value: `${r.enabled ? ch.emotes.enabled : ch.emotes.disabled} - ID: ${ch.util.makeInlineCode(
   r.id,
  )}`,
 }));

 const embeds = multiRowHelpers.embeds(fields, language, lan);
 embeds[0].description = lan.desc(
  Number(
   automodRules?.filter((r) => r.triggerType === Discord.AutoModerationRuleTriggerType.Keyword)
    .length,
  ),
  Number(
   automodRules?.filter((r) => r.triggerType === Discord.AutoModerationRuleTriggerType.MentionSpam)
    .length,
  ),
  Number(
   automodRules?.filter((r) => r.triggerType === Discord.AutoModerationRuleTriggerType.Spam).length,
  ),
  Number(
   automodRules?.filter(
    (r) => r.triggerType === Discord.AutoModerationRuleTriggerType.KeywordPreset,
   ).length,
  ),
 );

 const components = getAllComponents(language, automodRules);
 multiRowHelpers.noFields(embeds, language);

 if (cmd.isButton()) {
  cmd.update({
   embeds,
   components,
  });
  return;
 }
 cmd.reply({
  embeds,
  components,
  ephemeral: true,
 });
};

export const getEmbeds = (
 embedParsers: typeof ch.settingsHelpers.embedParsers,
 rule: Discord.AutoModerationRule,
 language: CT.Language,
 lan: CT.Language['slashCommands']['settings']['categories'][typeof name],
): Discord.APIEmbed[] => [
 {
  footer: { text: `${language.name}: ${rule.name}` },
  description: ch.constants.tutorials[name as keyof typeof ch.constants.tutorials]?.length
   ? `${language.slashCommands.settings.tutorial}\n${ch.constants.tutorials[
      name as keyof typeof ch.constants.tutorials
     ].map((t) => `[${t.name}](${t.link})`)}`
   : undefined,
  author: embedParsers.author(language, lan),
  fields:
   rule.triggerType !== (2 as never)
    ? [
       {
        name: language.events.logs.automodRule.enabled,
        value: embedParsers.boolean(rule.enabled, language),
        inline: false,
       },
       {
        name: '\u200b',
        value: ch.util.makeUnderlined(ch.util.makeBold(language.Triggers)),
       },
       ...([Discord.AutoModerationRuleTriggerType.Keyword, 6].includes(rule.triggerType)
        ? [
           {
            name: language.events.logs.automodRule.keywordFilter,
            value: rule.triggerMetadata.keywordFilter.length
             ? ch.util.makeCodeBlock(rule.triggerMetadata.keywordFilter.join(', '))
             : language.None,
           },
           {
            name: language.events.logs.automodRule.regexPatterns,
            value: rule.triggerMetadata.regexPatterns.length
             ? ch.util.makeCodeBlock(rule.triggerMetadata.regexPatterns.join(', '))
             : language.None,
           },
          ]
        : []),
       ...(rule.triggerType === Discord.AutoModerationRuleTriggerType.KeywordPreset
        ? [
           {
            name: language.events.logs.automodRule.presets[1],
            value: embedParsers.boolean(rule.triggerMetadata.presets?.includes(1), language),
            inline: true,
           },
           {
            name: language.events.logs.automodRule.presets[2],
            value: embedParsers.boolean(rule.triggerMetadata.presets?.includes(2), language),
            inline: true,
           },
           {
            name: language.events.logs.automodRule.presets[3],
            value: embedParsers.boolean(rule.triggerMetadata.presets?.includes(3), language),
            inline: true,
           },
          ]
        : []),
       ...([
        Discord.AutoModerationRuleTriggerType.Keyword,
        Discord.AutoModerationRuleTriggerType.KeywordPreset,
        6,
       ].includes(rule.triggerType)
        ? [
           {
            name: language.events.logs.automodRule.allowList,
            value: rule.triggerMetadata.allowList.length
             ? ch.util.makeCodeBlock(rule.triggerMetadata.allowList.join(', '))
             : language.None,
           },
          ]
        : []),
       ...(rule.triggerType === Discord.AutoModerationRuleTriggerType.MentionSpam
        ? [
           {
            name: language.events.logs.automodRule.mentionTotalLimit,
            value: embedParsers.number(Number(rule.triggerMetadata.mentionTotalLimit), language),
           },
           {
            name: language.events.logs.automodRule.mentionRaidProtectionEnabled,
            value: embedParsers.boolean(
             rule.triggerMetadata.mentionRaidProtectionEnabled,
             language,
            ),
           },
          ]
        : []),
       {
        name: '\u200b',
        value: ch.util.makeUnderlined(ch.util.makeBold(language.events.logs.automodRule.actions)),
       },
       {
        name:
         language.events.logs.automodRule.actionsType[
          rule.eventType === Discord.AutoModerationRuleEventType.MessageSend
           ? Discord.AutoModerationActionType.BlockMessage
           : 4
         ],
        value: embedParsers.boolean(
         !!rule.actions.find(
          (r) =>
           r.type ===
           (rule.eventType === Discord.AutoModerationRuleEventType.MessageSend
            ? Discord.AutoModerationActionType.BlockMessage
            : 4),
         ),
         language,
        ),
       },
       ...(rule.eventType === Discord.AutoModerationRuleEventType.MessageSend &&
       getActionMetadata(rule, 'BlockMessage')
        ? [
           {
            name: language.events.logs.automodRule.warnMessage,
            value: ch.util.makeCodeBlock(
             rule.actions.find(
              (r) =>
               r.metadata.customMessage && r.type === Discord.AutoModerationActionType.BlockMessage,
             )?.metadata.customMessage || language.events.logs.automodRule.defaultMessage,
            ),
           },
          ]
        : []),
       {
        name:
         language.events.logs.automodRule.actionsType[
          Discord.AutoModerationActionType.SendAlertMessage
         ],
        value: getActionMetadata(rule, 'SendAlertMessage')?.channelId
         ? `${embedParsers.boolean(true, language)} - ${
            language.events.logs.automodRule.alertChannel
           }: <#${getActionMetadata(rule, 'SendAlertMessage')?.channelId}>`
         : embedParsers.boolean(false, language),
       },
       ...([
        Discord.AutoModerationRuleTriggerType.Keyword,
        Discord.AutoModerationRuleTriggerType.MentionSpam,
       ].includes(rule.triggerType)
        ? [
           {
            name:
             language.events.logs.automodRule.actionsType[Discord.AutoModerationActionType.Timeout],
            value: rule.actions.find((r) => r.type === Discord.AutoModerationActionType.Timeout)
             ? `${embedParsers.boolean(true, language)} - ${ch.util.makeInlineCode(
                getActionMetadata(rule, 'Timeout')?.durationSeconds
                 ? ch.moment(
                    Number(getActionMetadata(rule, 'Timeout')?.durationSeconds) * 1000,
                    language,
                   )
                 : ch.moment(60000, language),
               )}`
             : embedParsers.boolean(false, language),
           },
          ]
        : []),
       {
        name: '\u200b',
        value: ch.util.makeUnderlined(ch.util.makeBold(language.Overrides)),
       },
       {
        name: language.slashCommands.settings.wlrole,
        value: embedParsers.roles(
         rule.exemptRoles.map((o) => o.id),
         language,
        ),
       },
       ...(rule.eventType === Discord.AutoModerationRuleEventType.MessageSend
        ? [
           {
            name: language.slashCommands.settings.wlchannel,
            value: embedParsers.channels(
             rule.exemptChannels.map((o) => o.id),
             language,
            ),
           },
          ]
        : []),
      ]
    : [
       {
        name: language.Deprecated,
        value: language.errors.deprecatedByDiscord,
       },
      ],
 },
];

const getActionMetadata = (
 rule: Discord.AutoModerationRule,
 type: keyof typeof Discord.AutoModerationActionType,
) => rule.actions.find((r) => r.type === Discord.AutoModerationActionType[type])?.metadata;

export const getComponents = (
 rule: Discord.AutoModerationRule,
 language: CT.Language,
 lan: CT.Language['slashCommands']['settings']['categories']['blacklist-rules'],
): Discord.APIActionRowComponent<Discord.APIButtonComponent>[] =>
 [
  {
   type: Discord.ComponentType.ActionRow,
   components: [
    {
     type: Discord.ComponentType.Button,
     style: Discord.ButtonStyle.Danger,
     custom_id: `settings/autoModRule/display`,
     emoji: ch.emotes.back,
    },
    {
     type: Discord.ComponentType.Button,
     label: language.events.logs.automodRule.enabled,
     style: SH.getStyle(rule.enabled),
     custom_id: `settings/autoModRule/boolean_active_${rule.id}`,
     emoji: SH.getEmoji(rule.enabled, 'active'),
    },
    {
     type: Discord.ComponentType.Button,
     label: language.slashCommands.settings.delete,
     style: Discord.ButtonStyle.Danger,
     custom_id: `settings/autoModRule/delete_${rule.id}`,
     emoji: ch.emotes.minusBG,
    },
   ],
  },
  ...(rule.triggerType !== Discord.AutoModerationRuleTriggerType.Spam
   ? [
      {
       type: Discord.ComponentType.ActionRow,
       components: [
        ...([Discord.AutoModerationRuleTriggerType.Keyword, 6].includes(rule.triggerType)
         ? [
            {
             type: Discord.ComponentType.Button,
             label: language.events.logs.automodRule.keywordFilter,
             style: rule.triggerMetadata.keywordFilter
              ? Discord.ButtonStyle.Secondary
              : Discord.ButtonStyle.Primary,
             custom_id: `settings/autoModRule/strings_keywordFilter_${rule.id}`,
            },
            {
             type: Discord.ComponentType.Button,
             label: language.events.logs.automodRule.regexPatterns,
             style: rule.triggerMetadata.keywordFilter
              ? Discord.ButtonStyle.Secondary
              : Discord.ButtonStyle.Primary,
             custom_id: `settings/autoModRule/strings_regex_${rule.id}`,
            },
           ]
         : []),
        ...(rule.triggerType === Discord.AutoModerationRuleTriggerType.KeywordPreset
         ? [
            {
             type: Discord.ComponentType.Button,
             label:
              language.events.logs.automodRule.presets[
               Discord.AutoModerationRuleKeywordPresetType.Profanity
              ],
             style: rule.triggerMetadata.presets.includes(
              Discord.AutoModerationRuleKeywordPresetType.Profanity,
             )
              ? Discord.ButtonStyle.Secondary
              : Discord.ButtonStyle.Primary,
             custom_id: `settings/autoModRule/boolean_profanity_${rule.id}`,
             disabled:
              rule.triggerMetadata.presets.length === 1 &&
              rule.triggerMetadata.presets.includes(
               Discord.AutoModerationRuleKeywordPresetType.Profanity,
              ),
            },
            {
             type: Discord.ComponentType.Button,
             label:
              language.events.logs.automodRule.presets[
               Discord.AutoModerationRuleKeywordPresetType.SexualContent
              ],
             style: rule.triggerMetadata.presets.includes(
              Discord.AutoModerationRuleKeywordPresetType.SexualContent,
             )
              ? Discord.ButtonStyle.Secondary
              : Discord.ButtonStyle.Primary,
             custom_id: `settings/autoModRule/boolean_sexualContent_${rule.id}`,
             disabled:
              rule.triggerMetadata.presets.length === 1 &&
              rule.triggerMetadata.presets.includes(
               Discord.AutoModerationRuleKeywordPresetType.SexualContent,
              ),
            },
            {
             type: Discord.ComponentType.Button,
             label:
              language.events.logs.automodRule.presets[
               Discord.AutoModerationRuleKeywordPresetType.Slurs
              ],
             style: rule.triggerMetadata.presets.includes(
              Discord.AutoModerationRuleKeywordPresetType.Slurs,
             )
              ? Discord.ButtonStyle.Secondary
              : Discord.ButtonStyle.Primary,
             custom_id: `settings/autoModRule/boolean_slurs_${rule.id}`,
             disabled:
              rule.triggerMetadata.presets.length === 1 &&
              rule.triggerMetadata.presets.includes(
               Discord.AutoModerationRuleKeywordPresetType.Slurs,
              ),
            },
           ]
         : []),
        ...([
         Discord.AutoModerationRuleTriggerType.Keyword,
         Discord.AutoModerationRuleTriggerType.KeywordPreset,
         6,
        ].includes(rule.triggerType)
         ? [
            {
             type: Discord.ComponentType.Button,
             label: language.events.logs.automodRule.allowList,
             style: rule.triggerMetadata.allowList
              ? Discord.ButtonStyle.Secondary
              : Discord.ButtonStyle.Primary,
             custom_id: `settings/autoModRule/strings_allowList_${rule.id}`,
            },
           ]
         : []),
        ...(rule.triggerType === Discord.AutoModerationRuleTriggerType.MentionSpam
         ? [
            {
             type: Discord.ComponentType.Button,
             label: language.events.logs.automodRule.mentionTotalLimit,
             style: Discord.ButtonStyle.Secondary,
             custom_id: `settings/autoModRule/number_mentionTotalLimit_${rule.id}`,
            },
            {
             type: Discord.ComponentType.Button,
             label: language.events.logs.automodRule.mentionRaidProtectionEnabled,
             style: rule.triggerMetadata.mentionRaidProtectionEnabled
              ? Discord.ButtonStyle.Secondary
              : Discord.ButtonStyle.Primary,
             custom_id: `settings/autoModRule/boolean_mentionRaidProtectionEnabled_${rule.id}`,
            },
           ]
         : []),
       ] as Discord.APIButtonComponentWithCustomId[],
      },
     ]
   : []),
  {
   type: Discord.ComponentType.ActionRow,
   components: [
    {
     type: Discord.ComponentType.Button,
     label:
      rule.eventType === Discord.AutoModerationRuleEventType.MessageSend
       ? language.events.logs.automodRule.actionsType[Discord.AutoModerationActionType.BlockMessage]
       : language.events.logs.automodRule.actionsType[4],
     style: Discord.ButtonStyle.Secondary,
     custom_id: `settings/autoModRule/boolean_${
      rule.eventType === Discord.AutoModerationRuleEventType.MessageSend
       ? 'blockMessage'
       : 'blockInteraction'
     }_${rule.id}`,
     emoji: rule.actions.find(
      (r) =>
       r.type ===
       (rule.eventType === Discord.AutoModerationRuleEventType.MessageSend
        ? Discord.AutoModerationActionType.BlockMessage
        : 4),
     )
      ? ch.emotes.enabled
      : ch.emotes.disabled,
     disabled:
      rule.eventType !== Discord.AutoModerationRuleEventType.MessageSend ||
      (rule.actions.length === 1 &&
       !!rule.actions.find(
        (r) =>
         r.type ===
         (rule.eventType === Discord.AutoModerationRuleEventType.MessageSend
          ? Discord.AutoModerationActionType.BlockMessage
          : 4),
       )),
    },
    ...(rule.eventType === Discord.AutoModerationRuleEventType.MessageSend &&
    getActionMetadata(rule, 'BlockMessage')
     ? [
        {
         type: Discord.ComponentType.Button,
         label: lan.fields.customMessage.name,
         style: getActionMetadata(rule, 'BlockMessage')?.customMessage
          ? Discord.ButtonStyle.Secondary
          : Discord.ButtonStyle.Primary,
         custom_id: `settings/autoModRule/string_customMessage_${rule.id}`,
        },
       ]
     : []),
    ...(getActionMetadata(rule, 'SendAlertMessage')?.channelId
     ? [
        {
         type: Discord.ComponentType.Button,
         label:
          language.events.logs.automodRule.actionsType[
           Discord.AutoModerationActionType.SendAlertMessage
          ],
         style: Discord.ButtonStyle.Secondary,
         custom_id: `settings/autoModRule/boolean_sendAlertMessage_${rule.id}`,
         emoji: getActionMetadata(rule, 'SendAlertMessage')?.channelId
          ? ch.emotes.enabled
          : undefined,
         disabled:
          rule.actions.length === 1 && !!getActionMetadata(rule, 'SendAlertMessage')?.channelId,
        },
       ]
     : []),
    {
     type: Discord.ComponentType.Button,
     label: getActionMetadata(rule, 'SendAlertMessage')?.channelId
      ? language.events.logs.automodRule.alertChannel
      : language.events.logs.automodRule.actionsType[
         Discord.AutoModerationActionType.SendAlertMessage
        ],
     style: Discord.ButtonStyle.Secondary,
     custom_id: `settings/autoModRule/channel_${rule.id}`,
     emoji: getActionMetadata(rule, 'SendAlertMessage')?.channelId
      ? ch.emotes.channelTypes[0]
      : ch.emotes.disabled,
    },
   ] as Discord.APIButtonComponentWithCustomId[],
  },
  ...([
   Discord.AutoModerationRuleTriggerType.Keyword,
   Discord.AutoModerationRuleTriggerType.MentionSpam,
  ].includes(rule.triggerType)
   ? [
      {
       type: Discord.ComponentType.ActionRow,
       components: [
        ...(getActionMetadata(rule, 'Timeout')
         ? [
            {
             type: Discord.ComponentType.Button,
             label:
              language.events.logs.automodRule.actionsType[
               Discord.AutoModerationActionType.Timeout
              ],
             style: Discord.ButtonStyle.Secondary,
             custom_id: `settings/autoModRule/boolean_timeout_${rule.id}`,
             emoji: getActionMetadata(rule, 'Timeout') ? ch.emotes.enabled : ch.emotes.disabled,
             disabled: rule.actions.length === 1 && !!getActionMetadata(rule, 'Timeout'),
            },
           ]
         : []),
        {
         type: Discord.ComponentType.Button,
         label: getActionMetadata(rule, 'Timeout')
          ? language.events.logs.automodRule.timeoutDuration
          : language.events.logs.automodRule.actionsType[Discord.AutoModerationActionType.Timeout],
         style: Discord.ButtonStyle.Secondary,
         custom_id: `settings/autoModRule/timeoutDuration_${rule.id}`,
         emoji: getActionMetadata(rule, 'Timeout') ? undefined : ch.emotes.disabled,
        },
       ] as Discord.APIButtonComponentWithCustomId[],
      },
     ]
   : []),
  {
   type: Discord.ComponentType.ActionRow,
   components: [
    {
     type: Discord.ComponentType.Button,
     label: language.events.logs.automodRule.exemptRoles,
     style: rule.exemptRoles.size ? Discord.ButtonStyle.Secondary : Discord.ButtonStyle.Primary,
     custom_id: `settings/autoModRule/roles_${rule.id}`,
     emoji: ch.emotes.Role,
    },
    ...(rule.eventType === Discord.AutoModerationRuleEventType.MessageSend
     ? [
        {
         type: Discord.ComponentType.Button,
         label: language.events.logs.automodRule.exemptChannels,
         style: rule.exemptChannels.size
          ? Discord.ButtonStyle.Secondary
          : Discord.ButtonStyle.Primary,
         custom_id: `settings/autoModRule/channels_${rule.id}`,
         emoji: ch.emotes.channelTypes[0],
        },
       ]
     : []),
   ] as Discord.APIButtonComponentWithCustomId[],
  },
 ] as Discord.APIActionRowComponent<Discord.APIButtonComponent>[];

const getAllComponents = (
 language: CT.Language,
 automodRules: Discord.AutoModerationRule[] | undefined,
): Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] => {
 const lan = language.slashCommands.settings.categories['blacklist-rules'];

 const createKeywordRule = ch.settingsHelpers.buttonParsers.create(language, 'blacklist-rules');
 createKeywordRule.custom_id = 'settings/autoModRule/create_keyword';
 createKeywordRule.label = lan.keyword;
 const createMentionSpamRule = ch.settingsHelpers.buttonParsers.create(language, 'blacklist-rules');
 createMentionSpamRule.custom_id = 'settings/autoModRule/create_mention';
 createMentionSpamRule.label = lan.mention;
 const createSpamRule = ch.settingsHelpers.buttonParsers.create(language, 'blacklist-rules');
 createSpamRule.custom_id = 'settings/autoModRule/create_spam';
 createSpamRule.label = lan.spam;
 const createPresetRule = ch.settingsHelpers.buttonParsers.create(language, 'blacklist-rules');
 createPresetRule.custom_id = 'settings/autoModRule/create_preset';
 createPresetRule.label = lan.preset;
 const createMemberRule = ch.settingsHelpers.buttonParsers.create(language, 'blacklist-rules');
 createMemberRule.custom_id = 'settings/autoModRule/create_member';
 createMemberRule.label = lan.member;

 if (
  automodRules?.filter((r) => r.triggerType === Discord.AutoModerationRuleTriggerType.Keyword)
   .length === 6
 ) {
  createKeywordRule.disabled = true;
 }

 if (
  automodRules?.filter((r) => r.triggerType === Discord.AutoModerationRuleTriggerType.MentionSpam)
   .length === 1
 ) {
  createMentionSpamRule.disabled = true;
 }

 if (
  automodRules?.filter((r) => r.triggerType === Discord.AutoModerationRuleTriggerType.KeywordPreset)
   .length === 1
 ) {
  createPresetRule.disabled = true;
 }

 if (
  automodRules?.filter((r) => r.triggerType === Discord.AutoModerationRuleTriggerType.Spam)
   .length === 1
 ) {
  createSpamRule.disabled = true;
 }

 if (automodRules?.filter((r) => r.triggerType === (6 as never)).length === 1) {
  createMemberRule.disabled = true;
 }

 return [
  {
   type: Discord.ComponentType.ActionRow,
   components: [
    createKeywordRule,
    createMentionSpamRule,
    createPresetRule,
    createSpamRule,
    createMemberRule,
   ],
  },
 ];
};
