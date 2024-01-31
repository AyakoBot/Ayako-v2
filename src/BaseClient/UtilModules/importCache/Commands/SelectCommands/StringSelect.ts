const self = {
 'embed-builder': {
  create: {
   fields: {
    reload: async () => {
     self['embed-builder'].create.fields.file = await import(
      `../../../../../Commands/SelectCommands/StringSelect/embed-builder/create/fields.js?version=${Date.now()}`
     );
    },
    file: await import(
     `../../../../../Commands/SelectCommands/StringSelect/embed-builder/create/fields.js`
    ),
   },
   hex: {
    reload: async () => {
     self['embed-builder'].create.hex.file = await import(
      `../../../../../Commands/SelectCommands/StringSelect/embed-builder/create/hex.js?version=${Date.now()}`
     );
    },
    file: await import(
     `../../../../../Commands/SelectCommands/StringSelect/embed-builder/create/hex.js`
    ),
   },
   img: {
    reload: async () => {
     self['embed-builder'].create.img.file = await import(
      `../../../../../Commands/SelectCommands/StringSelect/embed-builder/create/img.js?version=${Date.now()}`
     );
    },
    file: await import(
     `../../../../../Commands/SelectCommands/StringSelect/embed-builder/create/img.js`
    ),
   },
   link: {
    reload: async () => {
     self['embed-builder'].create.link.file = await import(
      `../../../../../Commands/SelectCommands/StringSelect/embed-builder/create/link.js?version=${Date.now()}`
     );
    },
    file: await import(
     `../../../../../Commands/SelectCommands/StringSelect/embed-builder/create/link.js`
    ),
   },
   select: {
    reload: async () => {
     self['embed-builder'].create.select.file = await import(
      `../../../../../Commands/SelectCommands/StringSelect/embed-builder/create/select.js?version=${Date.now()}`
     );
    },
    file: await import(
     `../../../../../Commands/SelectCommands/StringSelect/embed-builder/create/select.js`
    ),
   },
   string: {
    reload: async () => {
     self['embed-builder'].create.string.file = await import(
      `../../../../../Commands/SelectCommands/StringSelect/embed-builder/create/string.js?version=${Date.now()}`
     );
    },
    file: await import(
     `../../../../../Commands/SelectCommands/StringSelect/embed-builder/create/string.js`
    ),
   },
   timestamp: {
    reload: async () => {
     self['embed-builder'].create.timestamp.file = await import(
      `../../../../../Commands/SelectCommands/StringSelect/embed-builder/create/timestamp.js?version=${Date.now()}`
     );
    },
    file: await import(
     `../../../../../Commands/SelectCommands/StringSelect/embed-builder/create/timestamp.js`
    ),
   },
  },
  select: {
   reload: async () => {
    self['embed-builder'].select.file = await import(
     `../../../../../Commands/SelectCommands/StringSelect/embed-builder/select.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/SelectCommands/StringSelect/embed-builder/select.js`
   ),
  },
 },
 help: {
  list: {
   reload: async () => {
    self.help.list.file = await import(
     `../../../../../Commands/SelectCommands/StringSelect/help/list.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SelectCommands/StringSelect/help/list.js`),
  },
  select: {
   reload: async () => {
    self.help.select.file = await import(
     `../../../../../Commands/SelectCommands/StringSelect/help/select.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SelectCommands/StringSelect/help/select.js`),
  },
  viewCommand: {
   reload: async () => {
    self.help.viewCommand.file = await import(
     `../../../../../Commands/SelectCommands/StringSelect/help/viewCommand.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SelectCommands/StringSelect/help/viewCommand.js`),
  },
 },
 roles: {
  'button-roles': {
   reload: async () => {
    self.roles['button-roles'].file = await import(
     `../../../../../Commands/SelectCommands/StringSelect/roles/button-roles.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SelectCommands/StringSelect/roles/button-roles.js`),
  },
  'reaction-roles': {
   reload: async () => {
    self.roles['reaction-roles'].file = await import(
     `../../../../../Commands/SelectCommands/StringSelect/roles/reaction-roles.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/SelectCommands/StringSelect/roles/reaction-roles.js`
   ),
  },
 },
 rp: {
  block: {
   reload: async () => {
    self.rp.block.file = await import(
     `../../../../../Commands/SelectCommands/StringSelect/rp/block.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SelectCommands/StringSelect/rp/block.js`),
  },
 },
 'self-roles': {
  category: {
   reload: async () => {
    self['self-roles'].category.file = await import(
     `../../../../../Commands/SelectCommands/StringSelect/self-roles/category.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SelectCommands/StringSelect/self-roles/category.js`),
  },
  role: {
   reload: async () => {
    self['self-roles'].role.file = await import(
     `../../../../../Commands/SelectCommands/StringSelect/self-roles/role.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SelectCommands/StringSelect/self-roles/role.js`),
  },
 },
 settings: {
  'antiraid-punishment': {
   reload: async () => {
    self.settings['antiraid-punishment'].file = await import(
     `../../../../../Commands/SelectCommands/StringSelect/settings/antiraid-punishment.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/SelectCommands/StringSelect/settings/antiraid-punishment.js`
   ),
  },
  'auto-punishment': {
   reload: async () => {
    self.settings['auto-punishment'].file = await import(
     `../../../../../Commands/SelectCommands/StringSelect/settings/auto-punishment.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/SelectCommands/StringSelect/settings/auto-punishment.js`
   ),
  },
  automodrules: {
   reload: async () => {
    self.settings.automodrules.file = await import(
     `../../../../../Commands/SelectCommands/StringSelect/settings/automodrules.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/SelectCommands/StringSelect/settings/automodrules.js`
   ),
  },
  commands: {
   reload: async () => {
    self.settings.commands.file = await import(
     `../../../../../Commands/SelectCommands/StringSelect/settings/commands.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SelectCommands/StringSelect/settings/commands.js`),
  },
  embed: {
   reload: async () => {
    self.settings.embed.file = await import(
     `../../../../../Commands/SelectCommands/StringSelect/settings/embed.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SelectCommands/StringSelect/settings/embed.js`),
  },
  language: {
   reload: async () => {
    self.settings.language.file = await import(
     `../../../../../Commands/SelectCommands/StringSelect/settings/language.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SelectCommands/StringSelect/settings/language.js`),
  },
  lvlupmode: {
   reload: async () => {
    self.settings.lvlupmode.file = await import(
     `../../../../../Commands/SelectCommands/StringSelect/settings/lvlupmode.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SelectCommands/StringSelect/settings/lvlupmode.js`),
  },
  punishment: {
   reload: async () => {
    self.settings.punishment.file = await import(
     `../../../../../Commands/SelectCommands/StringSelect/settings/punishment.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SelectCommands/StringSelect/settings/punishment.js`),
  },
  questions: {
   reload: async () => {
    self.settings.questions.file = await import(
     `../../../../../Commands/SelectCommands/StringSelect/settings/questions.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SelectCommands/StringSelect/settings/questions.js`),
  },
  settinglink: {
   reload: async () => {
    self.settings.settinglink.file = await import(
     `../../../../../Commands/SelectCommands/StringSelect/settings/settinglink.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/SelectCommands/StringSelect/settings/settinglink.js`
   ),
  },
  shoptype: {
   reload: async () => {
    self.settings.shoptype.file = await import(
     `../../../../../Commands/SelectCommands/StringSelect/settings/shoptype.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SelectCommands/StringSelect/settings/shoptype.js`),
  },
  'weekends-type': {
   reload: async () => {
    self.settings['weekends-type'].file = await import(
     `../../../../../Commands/SelectCommands/StringSelect/settings/weekends-type.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/SelectCommands/StringSelect/settings/weekends-type.js`
   ),
  },
 },
 shop: {
  buy: {
   reload: async () => {
    self.shop.buy.file = await import(
     `../../../../../Commands/SelectCommands/StringSelect/shop/buy.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SelectCommands/StringSelect/shop/buy.js`),
  },
  equip: {
   reload: async () => {
    self.shop.equip.file = await import(
     `../../../../../Commands/SelectCommands/StringSelect/shop/equip.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SelectCommands/StringSelect/shop/equip.js`),
  },
 },
 check: {
  reload: async () => {
   self.check.file = await import(
    `../../../../../Commands/SelectCommands/StringSelect/check.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SelectCommands/StringSelect/check.js`),
 },
};

export default self;
