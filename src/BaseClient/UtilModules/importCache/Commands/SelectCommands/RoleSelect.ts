const self = {
 emojis: {
  roles: {
   reload: async () => {
    self.emojis.roles.file = await import(
     `../../../../../Commands/SelectCommands/RoleSelect/emojis/roles.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SelectCommands/RoleSelect/emojis/roles.js`),
  },
 },
 roles: {
  'button-roles': {
   reload: async () => {
    self.roles['button-roles'].file = await import(
     `../../../../../Commands/SelectCommands/RoleSelect/roles/button-roles.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SelectCommands/RoleSelect/roles/button-roles.js`),
  },
  'reaction-roles': {
   reload: async () => {
    self.roles['reaction-roles'].file = await import(
     `../../../../../Commands/SelectCommands/RoleSelect/roles/reaction-roles.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SelectCommands/RoleSelect/roles/reaction-roles.js`),
  },
 },
 'set-level': {
  excluded: {
   reload: async () => {
    self['set-level'].excluded.file = await import(
     `../../../../../Commands/SelectCommands/RoleSelect/set-level/excluded.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SelectCommands/RoleSelect/set-level/excluded.js`),
  },
 },
 settings: {
  role: {
   reload: async () => {
    self.settings.role.file = await import(
     `../../../../../Commands/SelectCommands/RoleSelect/settings/role.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SelectCommands/RoleSelect/settings/role.js`),
  },
  roles: {
   reload: async () => {
    self.settings.roles.file = await import(
     `../../../../../Commands/SelectCommands/RoleSelect/settings/roles.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SelectCommands/RoleSelect/settings/roles.js`),
  },
 },
};

export default self;
