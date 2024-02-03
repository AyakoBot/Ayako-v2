const self = {
 guildMemberAdd: {
  reload: async () => {
   self.guildMemberAdd.file = await import(
    `../../../../../Commands/ButtonCommands/events/guildMemberAdd.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/events/guildMemberAdd.js`),
 },
};

export default self;
