const self = {
 constants: {
  reload: async () => {
   self.constants.file = await import(`../../../Other/constants.js?version=${Date.now()}`);
  },
  file: await import(`../../../Other/constants.js`),
 },
};

export default self;
