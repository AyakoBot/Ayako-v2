const self = {
 pardon: {
  one: {
   reload: async () => {
    self.pardon.one.file = await import(
     `../../../../../Commands/AutocompleteCommands/mod/pardon/one.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/AutocompleteCommands/mod/pardon/one.js`),
  },
 },
};

export default self;
