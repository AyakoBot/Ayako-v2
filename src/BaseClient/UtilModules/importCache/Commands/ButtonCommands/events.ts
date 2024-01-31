const self = {
 guildMemberAdd: {
  version: 0,
  reload: async () => {
   self.guildMemberAdd.file = await import(
    `../../../../../Commands/ButtonCommands/events/guildMemberAdd.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/events/guildMemberAdd.js`),
 },
};

export default self;
