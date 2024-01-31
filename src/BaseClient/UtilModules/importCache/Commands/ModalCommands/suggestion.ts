const self = {
 accept: {
  reload: async () => {
   self.accept.file = await import(
    `../../../../../Commands/ModalCommands/suggestion/accept.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ModalCommands/suggestion/accept.js`),
 },
};

export default self;
