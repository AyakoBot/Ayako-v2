const self = {
 reload: async () => {
  self.file = await import(`../../../../../Commands/ModalCommands/check.js?version=${Date.now()}`);
 },
 file: await import(`../../../../../Commands/ModalCommands/check.js`),
};

export default self;
