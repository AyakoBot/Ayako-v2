const self = {
 components: {
  reload: async () => {
   self.components.file = await import(
    `../../../../settingsHelpers/multiRowHelpers/components.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/multiRowHelpers/components.js`),
 },
 options: {
  reload: async () => {
   self.options.file = await import(
    `../../../../settingsHelpers/multiRowHelpers/options.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/multiRowHelpers/options.js`),
 },
 embeds: {
  reload: async () => {
   self.embeds.file = await import(
    `../../../../settingsHelpers/multiRowHelpers/embeds.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/multiRowHelpers/embeds.js`),
 },
 noFields: {
  reload: async () => {
   self.noFields.file = await import(
    `../../../../settingsHelpers/multiRowHelpers/noFields.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/multiRowHelpers/noFields.js`),
 },
};

export default self;
