const self = {
 back: {
  reload: async () => {
   self.back.file = await import(
    `../../../../settingsHelpers/buttonParsers/back.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/buttonParsers/back.js`),
 },
 delete: {
  reload: async () => {
   self.delete.file = await import(
    `../../../../settingsHelpers/buttonParsers/delete.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/buttonParsers/delete.js`),
 },
 global: {
  reload: async () => {
   self.global.file = await import(
    `../../../../settingsHelpers/buttonParsers/global.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/buttonParsers/global.js`),
 },
 next: {
  reload: async () => {
   self.next.file = await import(
    `../../../../settingsHelpers/buttonParsers/next.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/buttonParsers/next.js`),
 },
 previous: {
  reload: async () => {
   self.previous.file = await import(
    `../../../../settingsHelpers/buttonParsers/previous.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/buttonParsers/previous.js`),
 },
 setting: {
  reload: async () => {
   self.setting.file = await import(
    `../../../../settingsHelpers/buttonParsers/setting.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/buttonParsers/setting.js`),
 },
 specific: {
  reload: async () => {
   self.specific.file = await import(
    `../../../../settingsHelpers/buttonParsers/specific.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/buttonParsers/specific.js`),
 },
 boolean: {
  reload: async () => {
   self.boolean.file = await import(
    `../../../../settingsHelpers/buttonParsers/boolean.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/buttonParsers/boolean.js`),
 },
};

export default self;
