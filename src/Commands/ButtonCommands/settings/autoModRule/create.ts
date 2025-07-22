import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

const settingName = CT.SettingNames.DenylistRules;

const f = async (cmd: Discord.ButtonInteraction, args: []) => {
 if (!cmd.inCachedGuild()) return;

 const type = args.shift() as 'keyword' | 'mention' | 'spam' | 'preset' | 'member' | undefined;
 if (!type) {
  cmd.client.util.error(cmd.guild, new Error('No type provided'));
  return;
 }

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.settings.categories[settingName];

 const rule = await cmd.client.util.request.guilds.createAutoModerationRule(
  cmd.guild,
  {
   name: lan[type],
   event_type: getEventType(type),
   trigger_type: getTriggerType(type),
   trigger_metadata: getTriggerMetadata(type),
   actions: [
    {
     type: type === 'member' ? (4 as never) : Discord.AutoModerationActionType.BlockMessage,
    },
   ],
   enabled: false,
  },
  cmd.user.username,
 );

 if ('message' in rule) {
  cmd.client.util.errorCmd(cmd, rule, language);
  return;
 }

 // @ts-expect-error Error overwrite for automod rules
 cmd.client.util.settingsHelpers.showOverview(cmd, settingName, rule, language);
};

export default f;

const getEventType = (type: 'keyword' | 'mention' | 'spam' | 'preset' | 'member') => {
 switch (type) {
  case 'member': {
   return 2 as never;
  }
  default: {
   return Discord.AutoModerationRuleEventType.MessageSend;
  }
 }
};

const getTriggerType = (type: 'keyword' | 'mention' | 'spam' | 'preset' | 'member') => {
 switch (type) {
  case 'mention': {
   return Discord.AutoModerationRuleTriggerType.MentionSpam;
  }
  case 'spam': {
   return Discord.AutoModerationRuleTriggerType.Spam;
  }
  case 'preset': {
   return Discord.AutoModerationRuleTriggerType.KeywordPreset;
  }
  case 'member': {
   return 6 as never;
  }
  default: {
   return Discord.AutoModerationRuleTriggerType.Keyword;
  }
 }
};

const getTriggerMetadata = (
 type: 'keyword' | 'mention' | 'spam' | 'preset' | 'member',
): Discord.APIAutoModerationRuleTriggerMetadata | undefined => {
 switch (type) {
  case 'mention': {
   return {
    mention_total_limit: 20,
    mention_raid_protection_enabled: true,
   };
  }
  case 'spam': {
   return undefined;
  }
  case 'preset': {
   return {
    presets: [
     Discord.AutoModerationRuleKeywordPresetType.Profanity,
     Discord.AutoModerationRuleKeywordPresetType.SexualContent,
     Discord.AutoModerationRuleKeywordPresetType.Slurs,
    ],
   };
  }
  default: {
   return {
    keyword_filter: ['discord.gg/'],
   };
  }
 }
};
