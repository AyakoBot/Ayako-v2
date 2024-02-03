const self = {
 autoModRule: {
  boolean: {
   reload: async () => {
    self.autoModRule.boolean.file = await import(
     `../../../../../Commands/ButtonCommands/settings/autoModRule/boolean.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/autoModRule/boolean.js`),
  },
  channel: {
   reload: async () => {
    self.autoModRule.channel.file = await import(
     `../../../../../Commands/ButtonCommands/settings/autoModRule/channel.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/autoModRule/channel.js`),
  },
  channels: {
   reload: async () => {
    self.autoModRule.channels.file = await import(
     `../../../../../Commands/ButtonCommands/settings/autoModRule/channels.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/autoModRule/channels.js`),
  },
  create: {
   reload: async () => {
    self.autoModRule.create.file = await import(
     `../../../../../Commands/ButtonCommands/settings/autoModRule/create.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/autoModRule/create.js`),
  },
  delete: {
   reload: async () => {
    self.autoModRule.delete.file = await import(
     `../../../../../Commands/ButtonCommands/settings/autoModRule/delete.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/autoModRule/delete.js`),
  },
  display: {
   reload: async () => {
    self.autoModRule.display.file = await import(
     `../../../../../Commands/ButtonCommands/settings/autoModRule/display.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/autoModRule/display.js`),
  },
  roles: {
   reload: async () => {
    self.autoModRule.roles.file = await import(
     `../../../../../Commands/ButtonCommands/settings/autoModRule/roles.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/autoModRule/roles.js`),
  },
  string: {
   reload: async () => {
    self.autoModRule.string.file = await import(
     `../../../../../Commands/ButtonCommands/settings/autoModRule/string.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/autoModRule/string.js`),
  },
  strings: {
   reload: async () => {
    self.autoModRule.strings.file = await import(
     `../../../../../Commands/ButtonCommands/settings/autoModRule/strings.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/autoModRule/strings.js`),
  },
  timeoutDuration: {
   reload: async () => {
    self.autoModRule.timeoutDuration.file = await import(
     `../../../../../Commands/ButtonCommands/settings/autoModRule/timeoutDuration.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/ButtonCommands/settings/autoModRule/timeoutDuration.js`
   ),
  },
 },
 done: {
  autoModRule: {
   channel: {
    reload: async () => {
     self.done.autoModRule.channel.file = await import(
      `../../../../../Commands/ButtonCommands/settings/autoModRule/channel.js?version=${Date.now()}`
     );
    },
    file: await import(`../../../../../Commands/ButtonCommands/settings/autoModRule/channel.js`),
   },
   channels: {
    reload: async () => {
     self.done.autoModRule.channels.file = await import(
      `../../../../../Commands/ButtonCommands/settings/autoModRule/channels.js?version=${Date.now()}`
     );
    },
    file: await import(`../../../../../Commands/ButtonCommands/settings/autoModRule/channels.js`),
   },
   roles: {
    reload: async () => {
     self.done.autoModRule.roles.file = await import(
      `../../../../../Commands/ButtonCommands/settings/autoModRule/roles.js?version=${Date.now()}`
     );
    },
    file: await import(`../../../../../Commands/ButtonCommands/settings/autoModRule/roles.js`),
   },
  },
  'antiraid-punishment': {
   reload: async () => {
    self.done['antiraid-punishment'].file = await import(
     `../../../../../Commands/ButtonCommands/settings/done/antiraid-punishment.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/ButtonCommands/settings/done/antiraid-punishment.js`
   ),
  },
  'auto-punishment': {
   reload: async () => {
    self.done['auto-punishment'].file = await import(
     `../../../../../Commands/ButtonCommands/settings/done/auto-punishment.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/done/auto-punishment.js`),
  },
  automodrules: {
   reload: async () => {
    self.done.automodrules.file = await import(
     `../../../../../Commands/ButtonCommands/settings/done/automodrules.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/done/automodrules.js`),
  },
  channel: {
   reload: async () => {
    self.done.channel.file = await import(
     `../../../../../Commands/ButtonCommands/settings/done/channel.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/done/channel.js`),
  },
  channels: {
   reload: async () => {
    self.done.channels.file = await import(
     `../../../../../Commands/ButtonCommands/settings/done/channels.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/done/channels.js`),
  },
  commands: {
   reload: async () => {
    self.done.commands.file = await import(
     `../../../../../Commands/ButtonCommands/settings/done/commands.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/done/commands.js`),
  },
  embed: {
   reload: async () => {
    self.done.embed.file = await import(
     `../../../../../Commands/ButtonCommands/settings/done/embed.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/done/embed.js`),
  },
  emote: {
   reload: async () => {
    self.done.emote.file = await import(
     `../../../../../Commands/ButtonCommands/settings/done/emote.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/done/emote.js`),
  },
  language: {
   reload: async () => {
    self.done.language.file = await import(
     `../../../../../Commands/ButtonCommands/settings/done/language.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/done/language.js`),
  },
  lvlupmode: {
   reload: async () => {
    self.done.lvlupmode.file = await import(
     `../../../../../Commands/ButtonCommands/settings/done/lvlupmode.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/done/lvlupmode.js`),
  },
  position: {
   reload: async () => {
    self.done.position.file = await import(
     `../../../../../Commands/ButtonCommands/settings/done/position.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/done/position.js`),
  },
  punishment: {
   reload: async () => {
    self.done.punishment.file = await import(
     `../../../../../Commands/ButtonCommands/settings/done/punishment.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/done/punishment.js`),
  },
  questions: {
   reload: async () => {
    self.done.questions.file = await import(
     `../../../../../Commands/ButtonCommands/settings/done/questions.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/done/questions.js`),
  },
  role: {
   reload: async () => {
    self.done.role.file = await import(
     `../../../../../Commands/ButtonCommands/settings/done/role.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/done/role.js`),
  },
  roles: {
   reload: async () => {
    self.done.roles.file = await import(
     `../../../../../Commands/ButtonCommands/settings/done/roles.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/done/roles.js`),
  },
  settinglink: {
   reload: async () => {
    self.done.settinglink.file = await import(
     `../../../../../Commands/ButtonCommands/settings/done/settinglink.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/done/settinglink.js`),
  },
  shoptype: {
   reload: async () => {
    self.done.shoptype.file = await import(
     `../../../../../Commands/ButtonCommands/settings/done/shoptype.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/done/shoptype.js`),
  },
  user: {
   reload: async () => {
    self.done.user.file = await import(
     `../../../../../Commands/ButtonCommands/settings/done/user.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/done/user.js`),
  },
  users: {
   reload: async () => {
    self.done.users.file = await import(
     `../../../../../Commands/ButtonCommands/settings/done/users.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/done/users.js`),
  },
  'weekends-type': {
   reload: async () => {
    self.done['weekends-type'].file = await import(
     `../../../../../Commands/ButtonCommands/settings/done/weekends-type.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/done/weekends-type.js`),
  },
 },
 editors: {
  'antiraid-punishment': {
   reload: async () => {
    self.editors['antiraid-punishment'].file = await import(
     `../../../../../Commands/ButtonCommands/settings/editors/antiraid-punishment.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/ButtonCommands/settings/editors/antiraid-punishment.js`
   ),
  },
  'auto-punishment': {
   reload: async () => {
    self.editors['auto-punishment'].file = await import(
     `../../../../../Commands/ButtonCommands/settings/editors/auto-punishment.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/editors/auto-punishment.js`),
  },
  automodrules: {
   reload: async () => {
    self.editors.automodrules.file = await import(
     `../../../../../Commands/ButtonCommands/settings/editors/automodrules.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/editors/automodrules.js`),
  },
  boolean: {
   reload: async () => {
    self.editors.boolean.file = await import(
     `../../../../../Commands/ButtonCommands/settings/editors/boolean.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/editors/boolean.js`),
  },
  'bot-token': {
   reload: async () => {
    self.editors['bot-token'].file = await import(
     `../../../../../Commands/ButtonCommands/settings/editors/bot-token.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/editors/bot-token.js`),
  },
  category: {
   reload: async () => {
    self.editors.category.file = await import(
     `../../../../../Commands/ButtonCommands/settings/editors/category.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/editors/category.js`),
  },
  channel: {
   reload: async () => {
    self.editors.channel.file = await import(
     `../../../../../Commands/ButtonCommands/settings/editors/channel.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/editors/channel.js`),
  },
  channels: {
   reload: async () => {
    self.editors.channels.file = await import(
     `../../../../../Commands/ButtonCommands/settings/editors/channels.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/editors/channels.js`),
  },
  command: {
   reload: async () => {
    self.editors.command.file = await import(
     `../../../../../Commands/ButtonCommands/settings/editors/command.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/editors/command.js`),
  },
  duration: {
   reload: async () => {
    self.editors.duration.file = await import(
     `../../../../../Commands/ButtonCommands/settings/editors/duration.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/editors/duration.js`),
  },
  embed: {
   reload: async () => {
    self.editors.embed.file = await import(
     `../../../../../Commands/ButtonCommands/settings/editors/embed.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/editors/embed.js`),
  },
  emote: {
   reload: async () => {
    self.editors.emote.file = await import(
     `../../../../../Commands/ButtonCommands/settings/editors/emote.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/editors/emote.js`),
  },
  language: {
   reload: async () => {
    self.editors.language.file = await import(
     `../../../../../Commands/ButtonCommands/settings/editors/language.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/editors/language.js`),
  },
  lvlupmode: {
   reload: async () => {
    self.editors.lvlupmode.file = await import(
     `../../../../../Commands/ButtonCommands/settings/editors/lvlupmode.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/editors/lvlupmode.js`),
  },
  message: {
   reload: async () => {
    self.editors.message.file = await import(
     `../../../../../Commands/ButtonCommands/settings/editors/message.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/editors/message.js`),
  },
  number: {
   reload: async () => {
    self.editors.number.file = await import(
     `../../../../../Commands/ButtonCommands/settings/editors/number.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/editors/number.js`),
  },
  position: {
   reload: async () => {
    self.editors.position.file = await import(
     `../../../../../Commands/ButtonCommands/settings/editors/position.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/editors/position.js`),
  },
  punishment: {
   reload: async () => {
    self.editors.punishment.file = await import(
     `../../../../../Commands/ButtonCommands/settings/editors/punishment.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/editors/punishment.js`),
  },
  'question-type': {
   reload: async () => {
    self.editors['question-type'].file = await import(
     `../../../../../Commands/ButtonCommands/settings/editors/question-type.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/editors/question-type.js`),
  },
  role: {
   reload: async () => {
    self.editors.role.file = await import(
     `../../../../../Commands/ButtonCommands/settings/editors/role.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/editors/role.js`),
  },
  roles: {
   reload: async () => {
    self.editors.roles.file = await import(
     `../../../../../Commands/ButtonCommands/settings/editors/roles.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/editors/roles.js`),
  },
  settinglink: {
   reload: async () => {
    self.editors.settinglink.file = await import(
     `../../../../../Commands/ButtonCommands/settings/editors/settinglink.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/editors/settinglink.js`),
  },
  shoptype: {
   reload: async () => {
    self.editors.shoptype.file = await import(
     `../../../../../Commands/ButtonCommands/settings/editors/shoptype.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/editors/shoptype.js`),
  },
  string: {
   reload: async () => {
    self.editors.string.file = await import(
     `../../../../../Commands/ButtonCommands/settings/editors/string.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/editors/string.js`),
  },
  strings: {
   reload: async () => {
    self.editors.strings.file = await import(
     `../../../../../Commands/ButtonCommands/settings/editors/strings.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/editors/strings.js`),
  },
  token: {
   reload: async () => {
    self.editors.token.file = await import(
     `../../../../../Commands/ButtonCommands/settings/editors/token.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/editors/token.js`),
  },
  user: {
   reload: async () => {
    self.editors.user.file = await import(
     `../../../../../Commands/ButtonCommands/settings/editors/user.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/editors/user.js`),
  },
  users: {
   reload: async () => {
    self.editors.users.file = await import(
     `../../../../../Commands/ButtonCommands/settings/editors/users.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/editors/users.js`),
  },
  voice: {
   reload: async () => {
    self.editors.voice.file = await import(
     `../../../../../Commands/ButtonCommands/settings/editors/voice.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/editors/voice.js`),
  },
  'weekends-type': {
   reload: async () => {
    self.editors['weekends-type'].file = await import(
     `../../../../../Commands/ButtonCommands/settings/editors/weekends-type.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/editors/weekends-type.js`),
  },
 },
 empty: {
  autoModRule: {
   array: {
    reload: async () => {
     self.empty.autoModRule.array.file = await import(
      `../../../../../Commands/ButtonCommands/settings/autoModRule/array.js?version=${Date.now()}`
     );
    },
    file: await import(
     `../../../../../Commands/ButtonCommands/settings/empty/autoModRule/array.js`
    ),
   },
  },
  array: {
   reload: async () => {
    self.empty.array.file = await import(
     `../../../../../Commands/ButtonCommands/settings/empty/array.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/settings/empty/array.js`),
  },
 },
 create: {
  reload: async () => {
   self.create.file = await import(
    `../../../../../Commands/ButtonCommands/settings/create.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/settings/create.js`),
 },
 delete: {
  reload: async () => {
   self.delete.file = await import(
    `../../../../../Commands/ButtonCommands/settings/delete.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/settings/delete.js`),
 },
 settingsDisplay: {
  reload: async () => {
   self.settingsDisplay.file = await import(
    `../../../../../Commands/ButtonCommands/settings/settingsDisplay.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/settings/settingsDisplay.js`),
 },
};

export default self;
