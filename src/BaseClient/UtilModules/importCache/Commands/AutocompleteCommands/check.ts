const self = {
 reload: async () => {
  self.file = await import(
   `../../../../../Commands/AutocompleteCommands/check.js?version=${Date.now()}`
  );
 },
 file: await import(`../../../../../Commands/AutocompleteCommands/check.js`),
};

export default self;
