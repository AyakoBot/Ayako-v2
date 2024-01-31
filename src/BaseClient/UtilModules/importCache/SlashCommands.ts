const self = {
 reload: async () => {
  self.file = await import(`../../../SlashCommands/index.js?version=${Date.now()}`);
 },
 file: await import(`../../../SlashCommands/index.js`),
};

export default self;
