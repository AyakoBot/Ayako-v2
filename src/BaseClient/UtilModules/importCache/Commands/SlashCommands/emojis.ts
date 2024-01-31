const self = {
 create: {
  'from-file': {
   reload: async () => {
    self.create['from-file'].file = await import(
     `../../../../../Commands/SlashCommands/emojis/create/from-file.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/emojis/create/from-file.js`),
  },
  'from-emoji': {
   reload: async () => {
    self.create['from-emoji'].file = await import(
     `../../../../../Commands/SlashCommands/emojis/create/from-emoji.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/emojis/create/from-emoji.js`),
  },
  'from-url': {
   reload: async () => {
    self.create['from-url'].file = await import(
     `../../../../../Commands/SlashCommands/emojis/create/from-url.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/emojis/create/from-url.js`),
  },
 },
 edit: {
  name: {
   reload: async () => {
    self.edit.name.file = await import(
     `../../../../../Commands/SlashCommands/emojis/edit/name.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/emojis/edit/name.js`),
  },
  roles: {
   reload: async () => {
    self.edit.roles.file = await import(
     `../../../../../Commands/SlashCommands/emojis/edit/roles.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/emojis/edit/roles.js`),
  },
 },
 delete: {
  reload: async () => {
   self.delete.file = await import(
    `../../../../../Commands/SlashCommands/emojis/delete.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/emojis/delete.js`),
 },
 info: {
  reload: async () => {
   self.info.file = await import(
    `../../../../../Commands/SlashCommands/emojis/info.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/emojis/info.js`),
 },
};

export default self;
