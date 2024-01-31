const self = {
 deleteThread: {
  version: 0,
  reload: async () => {
   self.deleteThread.file = await import(
    `../../../../../Commands/ButtonCommands/deleteThread.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/deleteThread.js`),
 },
 dismiss: {
  version: 0,
  reload: async () => {
   self.dismiss.file = await import(
    `../../../../../Commands/ButtonCommands/dismiss.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/dismiss.js`),
 },
 verify: {
  version: 0,
  reload: async () => {
   self.verify.file = await import(
    `../../../../../Commands/ButtonCommands/verify.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/verify.js`),
 },
};

export default self;
