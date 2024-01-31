const self = {
 appeals: {
  questions: {
   reload: async () => {
    self.appeals.questions.file = await import(
     `../../../../../Commands/AutocompleteCommands/settings/appeals/questions.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/AutocompleteCommands/settings/appeals/questions.js`),
  },
 },
 automation: {
  cooldowns: {
   reload: async () => {
    self.automation.cooldowns.file = await import(
     `../../../../../Commands/AutocompleteCommands/settings/automation/cooldowns.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/AutocompleteCommands/settings/automation/cooldowns.js`
   ),
  },
  'voice-hub': {
   reload: async () => {
    self.automation['voice-hub'].file = await import(
     `../../../../../Commands/AutocompleteCommands/settings/automation/voice-hub.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/AutocompleteCommands/settings/automation/voice-hub.js`
   ),
  },
 },
 leveling: {
  'level-roles': {
   reload: async () => {
    self.leveling['level-roles'].file = await import(
     `../../../../../Commands/AutocompleteCommands/settings/leveling/level-roles.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/AutocompleteCommands/settings/leveling/level-roles.js`
   ),
  },
  'multi-channels': {
   reload: async () => {
    self.leveling['multi-channels'].file = await import(
     `../../../../../Commands/AutocompleteCommands/settings/leveling/multi-channels.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/AutocompleteCommands/settings/leveling/multi-channels.js`
   ),
  },
  'multi-roles': {
   reload: async () => {
    self.leveling['multi-roles'].file = await import(
     `../../../../../Commands/AutocompleteCommands/settings/leveling/multi-roles.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/AutocompleteCommands/settings/leveling/multi-roles.js`
   ),
  },
  'rule-channels': {
   reload: async () => {
    self.leveling['rule-channels'].file = await import(
     `../../../../../Commands/AutocompleteCommands/settings/leveling/rule-channels.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/AutocompleteCommands/settings/leveling/rule-channels.js`
   ),
  },
 },
 moderation: {
  'auto-punish': {
   reload: async () => {
    self.moderation['auto-punish'].file = await import(
     `../../../../../Commands/AutocompleteCommands/settings/moderation/auto-punish.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/AutocompleteCommands/settings/moderation/auto-punish.js`
   ),
  },
  'denylist-rules': {
   reload: async () => {
    self.moderation['denylist-rules'].file = await import(
     `../../../../../Commands/AutocompleteCommands/settings/moderation/denylist-rules.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/AutocompleteCommands/settings/moderation/denylist-rules.js`
   ),
  },
 },
 nitro: {
  'boost-roles': {
   reload: async () => {
    self.nitro['boost-roles'].file = await import(
     `../../../../../Commands/AutocompleteCommands/settings/nitro/boost-roles.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/AutocompleteCommands/settings/nitro/boost-roles.js`),
  },
 },
 roles: {
  'button-role-settings': {
   reload: async () => {
    self.roles['button-role-settings'].file = await import(
     `../../../../../Commands/AutocompleteCommands/settings/roles/button-role-settings.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/AutocompleteCommands/settings/roles/button-role-settings.js`
   ),
  },
  'button-roles': {
   reload: async () => {
    self.roles['button-roles'].file = await import(
     `../../../../../Commands/AutocompleteCommands/settings/roles/button-roles.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/AutocompleteCommands/settings/roles/button-roles.js`
   ),
  },
  'reaction-role-settings': {
   reload: async () => {
    self.roles['reaction-role-settings'].file = await import(
     `../../../../../Commands/AutocompleteCommands/settings/roles/reaction-role-settings.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/AutocompleteCommands/settings/roles/reaction-role-settings.js`
   ),
  },
  'reaction-roles': {
   reload: async () => {
    self.roles['reaction-roles'].file = await import(
     `../../../../../Commands/AutocompleteCommands/settings/roles/reaction-roles.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/AutocompleteCommands/settings/roles/reaction-roles.js`
   ),
  },
  'role-rewards': {
   reload: async () => {
    self.roles['role-rewards'].file = await import(
     `../../../../../Commands/AutocompleteCommands/settings/roles/role-rewards.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/AutocompleteCommands/settings/roles/role-rewards.js`
   ),
  },
  'self-roles': {
   reload: async () => {
    self.roles['self-roles'].file = await import(
     `../../../../../Commands/AutocompleteCommands/settings/roles/self-roles.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/AutocompleteCommands/settings/roles/self-roles.js`),
  },
  separators: {
   reload: async () => {
    self.roles.separators.file = await import(
     `../../../../../Commands/AutocompleteCommands/settings/roles/separators.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/AutocompleteCommands/settings/roles/separators.js`),
  },
  'shop-items': {
   reload: async () => {
    self.roles['shop-items'].file = await import(
     `../../../../../Commands/AutocompleteCommands/settings/roles/shop-items.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/AutocompleteCommands/settings/roles/shop-items.js`),
  },
 },
 vote: {
  basic: {
   reload: async () => {
    self.vote.basic.file = await import(
     `../../../../../Commands/AutocompleteCommands/settings/vote/basic.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/AutocompleteCommands/settings/vote/basic.js`),
  },
  'vote-rewards': {
   reload: async () => {
    self.vote['vote-rewards'].file = await import(
     `../../../../../Commands/AutocompleteCommands/settings/vote/vote-rewards.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/AutocompleteCommands/settings/vote/vote-rewards.js`),
  },
 },
};

export default self;
