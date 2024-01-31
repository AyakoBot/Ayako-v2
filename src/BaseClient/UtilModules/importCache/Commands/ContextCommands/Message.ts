const self = {
 'stick-message': {
  reload: async () => {
   self['stick-message'].file = await import(
    `../../../../../Commands/ContextCommands/Message/stick-message.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ContextCommands/Message/stick-message.js`),
 },
};

export default self;
