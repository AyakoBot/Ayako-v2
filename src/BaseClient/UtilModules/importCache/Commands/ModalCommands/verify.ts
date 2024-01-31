const self = {
 reload: async () => {
  self.file = await import(`../../../../../Commands/ModalCommands/verify.js?version=${Date.now()}`);
 },
 file: await import(`../../../../../Commands/ModalCommands/verify.js`),
};

export default self;
