const self = {
 create: {
  reload: async () => {
   self.create.file = await import(
    `../../../../../Commands/SlashCommands/invites/create.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/invites/create.js`),
 },
 delete: {
  reload: async () => {
   self.delete.file = await import(
    `../../../../../Commands/SlashCommands/invites/delete.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/invites/delete.js`),
 },
 info: {
  reload: async () => {
   self.info.file = await import(
    `../../../../../Commands/SlashCommands/invites/info.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/invites/info.js`),
 },
};

export default self;
