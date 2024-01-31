const self = {
 appeals: {
  basic: {
   reload: async () => {
    self.appeals.basic.file = await import(
     `../../../../../Commands/SlashCommands/settings/appeals/basic.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/appeals/basic.js`),
  },
  questions: {
   reload: async () => {
    self.appeals.questions.file = await import(
     `../../../../../Commands/SlashCommands/settings/appeals/questions.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/appeals/questions.js`),
  },
 },
 automation: {
  censor: {
   reload: async () => {
    self.automation.censor.file = await import(
     `../../../../../Commands/SlashCommands/settings/automation/censor.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/automation/censor.js`),
  },
  cooldowns: {
   reload: async () => {
    self.automation.cooldowns.file = await import(
     `../../../../../Commands/SlashCommands/settings/automation/cooldowns.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/automation/cooldowns.js`),
  },
  'disboard-reminders': {
   reload: async () => {
    self.automation['disboard-reminders'].file = await import(
     `../../../../../Commands/SlashCommands/settings/automation/disboard-reminders.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/SlashCommands/settings/automation/disboard-reminders.js`
   ),
  },
  suggestions: {
   reload: async () => {
    self.automation.suggestions.file = await import(
     `../../../../../Commands/SlashCommands/settings/automation/suggestions.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/automation/suggestions.js`),
  },
  verification: {
   reload: async () => {
    self.automation.verification.file = await import(
     `../../../../../Commands/SlashCommands/settings/automation/verification.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/automation/verification.js`),
  },
  'voice-hub': {
   reload: async () => {
    self.automation['voice-hub'].file = await import(
     `../../../../../Commands/SlashCommands/settings/automation/voice-hub.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/automation/voice-hub.js`),
  },
  welcome: {
   reload: async () => {
    self.automation.welcome.file = await import(
     `../../../../../Commands/SlashCommands/settings/automation/welcome.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/automation/welcome.js`),
  },
 },
 leveling: {
  basic: {
   reload: async () => {
    self.leveling.basic.file = await import(
     `../../../../../Commands/SlashCommands/settings/leveling/basic.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/leveling/basic.js`),
  },
  'level-roles': {
   reload: async () => {
    self.leveling['level-roles'].file = await import(
     `../../../../../Commands/SlashCommands/settings/leveling/level-roles.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/leveling/level-roles.js`),
  },
  'multi-channels': {
   reload: async () => {
    self.leveling['multi-channels'].file = await import(
     `../../../../../Commands/SlashCommands/settings/leveling/multi-channels.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/leveling/multi-channels.js`),
  },
  'multi-roles': {
   reload: async () => {
    self.leveling['multi-roles'].file = await import(
     `../../../../../Commands/SlashCommands/settings/leveling/multi-roles.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/leveling/multi-roles.js`),
  },
  'reset-all': {
   reload: async () => {
    self.leveling['reset-all'].file = await import(
     `../../../../../Commands/SlashCommands/settings/leveling/reset-all.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/leveling/reset-all.js`),
  },
  'reset-role': {
   reload: async () => {
    self.leveling['reset-role'].file = await import(
     `../../../../../Commands/SlashCommands/settings/leveling/reset-role.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/leveling/reset-role.js`),
  },
  'reset-user': {
   reload: async () => {
    self.leveling['reset-user'].file = await import(
     `../../../../../Commands/SlashCommands/settings/leveling/reset-user.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/leveling/reset-user.js`),
  },
  'rule-channels': {
   reload: async () => {
    self.leveling['rule-channels'].file = await import(
     `../../../../../Commands/SlashCommands/settings/leveling/rule-channels.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/leveling/rule-channels.js`),
  },
  'set-level-role': {
   reload: async () => {
    self.leveling['set-level-role'].file = await import(
     `../../../../../Commands/SlashCommands/settings/leveling/set-level-role.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/leveling/set-level-role.js`),
  },
  'set-level-user': {
   reload: async () => {
    self.leveling['set-level-user'].file = await import(
     `../../../../../Commands/SlashCommands/settings/leveling/set-level-user.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/leveling/set-level-user.js`),
  },
 },
 moderation: {
  'anti-raid': {
   reload: async () => {
    self.moderation['anti-raid'].file = await import(
     `../../../../../Commands/SlashCommands/settings/moderation/anti-raid.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/moderation/anti-raid.js`),
  },
  'anti-spam': {
   reload: async () => {
    self.moderation['anti-spam'].file = await import(
     `../../../../../Commands/SlashCommands/settings/moderation/anti-spam.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/moderation/anti-spam.js`),
  },
  'anti-virus': {
   reload: async () => {
    self.moderation['anti-virus'].file = await import(
     `../../../../../Commands/SlashCommands/settings/moderation/anti-virus.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/moderation/anti-virus.js`),
  },
  'auto-punish': {
   reload: async () => {
    self.moderation['auto-punish'].file = await import(
     `../../../../../Commands/SlashCommands/settings/moderation/auto-punish.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/moderation/auto-punish.js`),
  },
  'denylist-rules': {
   reload: async () => {
    self.moderation['denylist-rules'].file = await import(
     `../../../../../Commands/SlashCommands/settings/moderation/denylist-rules.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/SlashCommands/settings/moderation/denylist-rules.js`
   ),
  },
  expiry: {
   reload: async () => {
    self.moderation.expiry.file = await import(
     `../../../../../Commands/SlashCommands/settings/moderation/expiry.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/moderation/expiry.js`),
  },
  invites: {
   reload: async () => {
    self.moderation.invites.file = await import(
     `../../../../../Commands/SlashCommands/settings/moderation/invites.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/moderation/invites.js`),
  },
  newlines: {
   reload: async () => {
    self.moderation.newlines.file = await import(
     `../../../../../Commands/SlashCommands/settings/moderation/newlines.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/moderation/newlines.js`),
  },
 },
 nitro: {
  basic: {
   reload: async () => {
    self.nitro.basic.file = await import(
     `../../../../../Commands/SlashCommands/settings/nitro/basic.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/nitro/basic.js`),
  },
  'booster-roles': {
   reload: async () => {
    self.nitro['booster-roles'].file = await import(
     `../../../../../Commands/SlashCommands/settings/nitro/booster-roles.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/nitro/booster-roles.js`),
  },
 },
 roles: {
  'auto-roles': {
   reload: async () => {
    self.roles['auto-roles'].file = await import(
     `../../../../../Commands/SlashCommands/settings/roles/auto-roles.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/roles/auto-roles.js`),
  },
  'button-role-settings': {
   reload: async () => {
    self.roles['button-role-settings'].file = await import(
     `../../../../../Commands/SlashCommands/settings/roles/button-role-settings.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/SlashCommands/settings/roles/button-role-settings.js`
   ),
  },
  'button-roles': {
   reload: async () => {
    self.roles['button-roles'].file = await import(
     `../../../../../Commands/SlashCommands/settings/roles/button-roles.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/roles/button-roles.js`),
  },
  'reaction-role-settings': {
   reload: async () => {
    self.roles['reaction-role-settings'].file = await import(
     `../../../../../Commands/SlashCommands/settings/roles/reaction-role-settings.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/SlashCommands/settings/roles/reaction-role-settings.js`
   ),
  },
  'reaction-roles': {
   reload: async () => {
    self.roles['reaction-roles'].file = await import(
     `../../../../../Commands/SlashCommands/settings/roles/reaction-roles.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/roles/reaction-roles.js`),
  },
  'role-rewards': {
   reload: async () => {
    self.roles['role-rewards'].file = await import(
     `../../../../../Commands/SlashCommands/settings/roles/role-rewards.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/roles/role-rewards.js`),
  },
  'self-roles': {
   reload: async () => {
    self.roles['self-roles'].file = await import(
     `../../../../../Commands/SlashCommands/settings/roles/self-roles.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/roles/self-roles.js`),
  },
  'separators-apply': {
   reload: async () => {
    self.roles['separators-apply'].file = await import(
     `../../../../../Commands/SlashCommands/settings/roles/separators-apply.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/roles/separators-apply.js`),
  },
  separators: {
   reload: async () => {
    self.roles.separators.file = await import(
     `../../../../../Commands/SlashCommands/settings/roles/separators.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/roles/separators.js`),
  },
  'shop-items': {
   reload: async () => {
    self.roles['shop-items'].file = await import(
     `../../../../../Commands/SlashCommands/settings/roles/shop-items.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/roles/shop-items.js`),
  },
  shop: {
   reload: async () => {
    self.roles.shop.file = await import(
     `../../../../../Commands/SlashCommands/settings/roles/shop.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/roles/shop.js`),
  },
  sticky: {
   reload: async () => {
    self.roles.sticky.file = await import(
     `../../../../../Commands/SlashCommands/settings/roles/sticky.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/roles/sticky.js`),
  },
 },
 vote: {
  basic: {
   reload: async () => {
    self.vote.basic.file = await import(
     `../../../../../Commands/SlashCommands/settings/vote/basic.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/vote/basic.js`),
  },
  'vote-rewards': {
   reload: async () => {
    self.vote['vote-rewards'].file = await import(
     `../../../../../Commands/SlashCommands/settings/vote/vote-rewards.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/settings/vote/vote-rewards.js`),
  },
 },
 basic: {
  reload: async () => {
   self.basic.file = await import(
    `../../../../../Commands/SlashCommands/settings/basic.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/settings/basic.js`),
 },
 logs: {
  reload: async () => {
   self.logs.file = await import(
    `../../../../../Commands/SlashCommands/settings/logs.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/settings/logs.js`),
 },
};

export default self;
