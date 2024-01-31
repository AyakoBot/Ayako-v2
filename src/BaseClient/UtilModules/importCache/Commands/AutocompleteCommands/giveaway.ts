const self = {
 cancel: {
  reload: async () => {
   self.cancel.file = await import(
    `../../../../../Commands/AutocompleteCommands/giveaway/cancel.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/AutocompleteCommands/giveaway/cancel.js`),
 },
 edit: {
  reload: async () => {
   self.edit.file = await import(
    `../../../../../Commands/AutocompleteCommands/giveaway/edit.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/AutocompleteCommands/giveaway/edit.js`),
 },
 end: {
  reload: async () => {
   self.end.file = await import(
    `../../../../../Commands/AutocompleteCommands/giveaway/end.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/AutocompleteCommands/giveaway/end.js`),
 },
 reroll: {
  reload: async () => {
   self.reroll.file = await import(
    `../../../../../Commands/AutocompleteCommands/giveaway/reroll.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/AutocompleteCommands/giveaway/reroll.js`),
 },
};

export default self;
