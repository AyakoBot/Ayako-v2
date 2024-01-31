const self = {
 Typings: {
  reload: async () => {
   self.Typings.file = await import(`../../../Typings/Typings.js?version=${Date.now()}`);
  },
  file: await import(`../../../Typings/Typings.js`),
 },
 Settings: {
  reload: async () => {
   self.Settings.file = await import(`../../../Typings/Settings.js`);
  },
  file: await import(`../../../Typings/Settings.js`),
 },
};

export default self;
