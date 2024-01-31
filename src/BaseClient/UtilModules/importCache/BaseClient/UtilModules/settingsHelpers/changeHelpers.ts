const self = {
 reload: async () => {
  self.file = await import(`../../../../settingsHelpers/changeHelpers.js?version=${Date.now()}`);
 },
 file: await import(`../../../../settingsHelpers/changeHelpers.js`),

 back: await import('./buttonParsers.js').then((x) => x.default.back),
 changeEmbed: {
  reload: async () => {
   self.changeEmbed.file = await import(
    `../../../../settingsHelpers/changeHelpers/changeEmbed.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/changeHelpers/changeEmbed.js`),
 },
 changeModal: {
  reload: async () => {
   self.changeModal.file = await import(
    `../../../../settingsHelpers/changeHelpers/changeModal.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/changeHelpers/changeModal.js`),
 },
 changeSelect: {
  reload: async () => {
   self.changeSelect.file = await import(
    `../../../../settingsHelpers/changeHelpers/changeSelect.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/changeHelpers/changeSelect.js`),
 },
 changeSelectGlobal: {
  reload: async () => {
   self.changeSelectGlobal.file = await import(
    `../../../../settingsHelpers/changeHelpers/changeSelectGlobal.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/changeHelpers/changeSelectGlobal.js`),
 },
 done: {
  reload: async () => {
   self.done.file = await import(
    `../../../../settingsHelpers/changeHelpers/done.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/changeHelpers/done.js`),
 },
 get: {
  reload: async () => {
   self.get.file = await import(
    `../../../../settingsHelpers/changeHelpers/get.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/changeHelpers/get.js`),
 },
 getAndInsert: {
  reload: async () => {
   self.getAndInsert.file = await import(
    `../../../../settingsHelpers/changeHelpers/getAndInsert.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/changeHelpers/getAndInsert.js`),
 },
 makeEmpty: {
  reload: async () => {
   self.makeEmpty.file = await import(
    `../../../../settingsHelpers/changeHelpers/makeEmpty.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/changeHelpers/makeEmpty.js`),
 },
 modal: {
  reload: async () => {
   self.modal.file = await import(
    `../../../../settingsHelpers/changeHelpers/modal.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/changeHelpers/modal.js`),
 },
};

export default self;
