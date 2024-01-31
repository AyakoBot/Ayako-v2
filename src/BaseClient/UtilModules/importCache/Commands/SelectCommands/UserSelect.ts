const self = {
 settings: {
  user: {
   reload: async () => {
    self.settings.user.file = await import(
     `../../../../../Commands/SelectCommands/UserSelect/settings/user.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SelectCommands/UserSelect/settings/user.js`),
  },
  users: {
   reload: async () => {
    self.settings.users.file = await import(
     `../../../../../Commands/SelectCommands/UserSelect/settings/users.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SelectCommands/UserSelect/settings/users.js`),
  },
 },
};

export default self;
