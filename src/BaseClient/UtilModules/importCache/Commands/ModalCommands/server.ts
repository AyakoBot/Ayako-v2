const self = {
 reload: async () => {
  self.file = await import(`../../../../../Commands/ModalCommands/server.js?version=${Date.now()}`);
 },
 file: await import(`../../../../../Commands/ModalCommands/server.js`),
};

export default self;
