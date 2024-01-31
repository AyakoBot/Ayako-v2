const self = {
 reload: async () => {
  self.file = await import(
   `../../../../../Commands/AutocompleteCommands/self-roles.js?version=${Date.now()}`
  );
 },
 file: await import(`../../../../../Commands/AutocompleteCommands/self-roles.js`),
};

export default self;
