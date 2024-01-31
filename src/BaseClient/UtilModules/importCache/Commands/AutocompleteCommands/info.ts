const self = {
 server: {
  reload: async () => {
   self.file = await import(
    `../../../../../Commands/AutocompleteCommands/info/server.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/AutocompleteCommands/info/server.js`),
 },
 user: {
  reload: async () => {
   self.user.file = await import(
    `../../../../../Commands/AutocompleteCommands/info/user.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/AutocompleteCommands/info/user.js`),
 },
};

export default self;
