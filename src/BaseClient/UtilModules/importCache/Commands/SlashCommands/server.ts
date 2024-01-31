const self = {
 info: {
  reload: async () => {
   self.info.file = await import(
    `../../../../../Commands/SlashCommands/server/info.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/server/info.js`),
 },
 list: {
  reload: async () => {
   self.list.file = await import(
    `../../../../../Commands/SlashCommands/server/list.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/server/list.js`),
 },
};

export default self;
