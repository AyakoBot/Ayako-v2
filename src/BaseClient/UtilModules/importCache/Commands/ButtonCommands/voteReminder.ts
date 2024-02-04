const self = {
 disable: {
  reload: async () => {
   self.disable.file = await import(
    `../../../../../Commands/ButtonCommands/voteReminder/disable.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/voteReminder/disable.js`),
 },
 enable: {
  reload: async () => {
   self.enable.file = await import(
    `../../../../../Commands/ButtonCommands/voteReminder/enable.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/voteReminder/enable.js`),
 },
};

export default self;
