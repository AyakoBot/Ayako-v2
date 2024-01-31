const self = {
 info: {
  reload: async () => {
   self.info.file = await import(
    `../../../../../Commands/AutocompleteCommands/server/info.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/AutocompleteCommands/server/info.js`),
 },
};

export default self;
