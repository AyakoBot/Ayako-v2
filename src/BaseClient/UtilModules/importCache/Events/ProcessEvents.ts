const self = {
 experimentalWarning: {
  reload: async () => {
   self.experimentalWarning.file = await import(
    `../../../../Events/ProcessEvents/experimentalWarning.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../Events/ProcessEvents/experimentalWarning.js`),
 },
 promiseRejectionHandledWarning: {
  reload: async () => {
   self.promiseRejectionHandledWarning.file = await import(
    `../../../../Events/ProcessEvents/promiseRejectionHandledWarning.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../Events/ProcessEvents/promiseRejectionHandledWarning.js`),
 },
 uncaughtException: {
  reload: async () => {
   self.uncaughtException.file = await import(
    `../../../../Events/ProcessEvents/uncaughtException.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../Events/ProcessEvents/uncaughtException.js`),
 },
 unhandledRejection: {
  reload: async () => {
   self.unhandledRejection.file = await import(
    `../../../../Events/ProcessEvents/unhandledRejection.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../Events/ProcessEvents/unhandledRejection.js`),
 },
 warning: {
  reload: async () => {
   self.warning.file = await import(
    `../../../../Events/ProcessEvents/warning.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../Events/ProcessEvents/warning.js`),
 },
};

export default self;
