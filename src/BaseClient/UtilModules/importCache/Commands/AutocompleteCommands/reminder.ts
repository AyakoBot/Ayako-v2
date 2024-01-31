const self = {
 delete: {
  reload: async () => {
   self.delete.file = await import(
    `../../../../../Commands/AutocompleteCommands/reminder/delete.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/AutocompleteCommands/reminder/delete.js`),
 },
 edit: {
  reload: async () => {
   self.edit.file = await import(
    `../../../../../Commands/AutocompleteCommands/reminder/edit.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/AutocompleteCommands/reminder/edit.js`),
 },
};

export default self;
