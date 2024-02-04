const self = {
 reload: async () => {
  self.file = await import(`../../../helpHelpers.js?version=${Date.now()}`);
 },
 file: await import(`../../../helpHelpers.js`),

 getDesc: {
  reload: async () => {
   self.getDesc.file = await import(`../../../helpHelpers/getDesc.js?version=${Date.now()}`);
  },
  file: await import(`../../../helpHelpers/getDesc.js`),
 },
 getDescription: {
  reload: async () => {
   self.getDescription.file = await import(
    `../../../helpHelpers/getDescription.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../helpHelpers/getDescription.js`),
 },
 getEmbeds: {
  reload: async () => {
   self.getEmbeds.file = await import(`../../../helpHelpers/getEmbeds.js?version=${Date.now()}`);
  },
  file: await import(`../../../helpHelpers/getEmbeds.js`),
 },
};

export default self;
