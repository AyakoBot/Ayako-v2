const self = {
 command: {
  reload: async () => {
   self.command.file = await import(
    `../../../../../Commands/AutocompleteCommands/help/command.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/AutocompleteCommands/help/command.js`),
 },
};

export default self;
