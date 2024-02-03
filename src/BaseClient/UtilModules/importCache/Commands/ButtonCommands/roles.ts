const self = {
 'button-roles': {
  delete: {
   reload: async () => {
    self['button-roles'].delete.file = await import(
     `../../../../../Commands/ButtonCommands/roles/button-roles/delete.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/roles/button-roles/delete.js`),
  },
  refresh: {
   reload: async () => {
    self['button-roles'].refresh.file = await import(
     `../../../../../Commands/ButtonCommands/roles/button-roles/refresh.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/roles/button-roles/refresh.js`),
  },
  resetReactions: {
   reload: async () => {
    self['button-roles'].resetReactions.file = await import(
     `../../../../../Commands/ButtonCommands/roles/button-roles/resetReactions.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/ButtonCommands/roles/button-roles/resetReactions.js`
   ),
  },
  save: {
   reload: async () => {
    self['button-roles'].save.file = await import(
     `../../../../../Commands/ButtonCommands/roles/button-roles/save.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/roles/button-roles/save.js`),
  },
  takeRole: {
   reload: async () => {
    self['button-roles'].takeRole.file = await import(
     `../../../../../Commands/ButtonCommands/roles/button-roles/takeRole.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/roles/button-roles/takeRole.js`),
  },
 },
 'reaction-roles': {
  delete: {
   reload: async () => {
    self['reaction-roles'].delete.file = await import(
     `../../../../../Commands/ButtonCommands/roles/reaction-roles/delete.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/roles/reaction-roles/delete.js`),
  },
  refresh: {
   reload: async () => {
    self['reaction-roles'].refresh.file = await import(
     `../../../../../Commands/ButtonCommands/roles/reaction-roles/refresh.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/roles/reaction-roles/refresh.js`),
  },
  resetReactions: {
   reload: async () => {
    self['reaction-roles'].resetReactions.file = await import(
     `../../../../../Commands/ButtonCommands/roles/reaction-roles/resetReactions.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/ButtonCommands/roles/reaction-roles/resetReactions.js`
   ),
  },
  save: {
   reload: async () => {
    self['reaction-roles'].save.file = await import(
     `../../../../../Commands/ButtonCommands/roles/reaction-roles/save.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/roles/reaction-roles/save.js`),
  },
 },
 delete: {
  reload: async () => {
   self.delete.file = await import(
    `../../../../../Commands/ButtonCommands/roles/delete.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/roles/delete.js`),
 },
};

export default self;
