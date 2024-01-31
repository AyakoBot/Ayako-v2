const self = {
 cancel: {
  reload: async () => {
   self.cancel.file = await import(
    `../../../../../Commands/SlashCommands/giveaway/cancel.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/giveaway/cancel.js`),
 },
 create: {
  reload: async () => {
   self.create.file = await import(
    `../../../../../Commands/SlashCommands/giveaway/create.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/giveaway/create.js`),
 },
 edit: {
  reload: async () => {
   self.edit.file = await import(
    `../../../../../Commands/SlashCommands/giveaway/edit.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/giveaway/edit.js`),
 },
 end: {
  reload: async () => {
   self.end.file = await import(
    `../../../../../Commands/SlashCommands/giveaway/end.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/giveaway/end.js`),
 },
 list: {
  reload: async () => {
   self.list.file = await import(
    `../../../../../Commands/SlashCommands/giveaway/list.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/giveaway/list.js`),
 },
};

export default self;
