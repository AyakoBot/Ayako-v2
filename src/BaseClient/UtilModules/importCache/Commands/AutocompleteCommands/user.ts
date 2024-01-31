const self = {
 info: {
  reload: async () => {
   self.info.file = await import(
    `../../../../../Commands/AutocompleteCommands/user/info.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/AutocompleteCommands/user/info.js`),
 },
};

export default self;
