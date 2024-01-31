const self = {
 create: {
  reload: async () => {
   self.create.file = await import(
    `../../../../../Commands/SlashCommands/reminder/create.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/reminder/create.js`),
 },
 delete: {
  reload: async () => {
   self.delete.file = await import(
    `../../../../../Commands/SlashCommands/reminder/delete.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/reminder/delete.js`),
 },
 edit: {
  reload: async () => {
   self.edit.file = await import(
    `../../../../../Commands/SlashCommands/reminder/edit.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/reminder/edit.js`),
 },
 list: {
  reload: async () => {
   self.list.file = await import(
    `../../../../../Commands/SlashCommands/reminder/list.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/reminder/list.js`),
 },
};

export default self;
