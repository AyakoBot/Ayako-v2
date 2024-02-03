const self = {
 deleteThread: {
  reload: async () => {
   self.deleteThread.file = await import(
    `../../../../../Commands/ButtonCommands/deleteThread.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/deleteThread.js`),
 },
 dismiss: {
  reload: async () => {
   self.dismiss.file = await import(
    `../../../../../Commands/ButtonCommands/dismiss.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/dismiss.js`),
 },
 verify: {
  reload: async () => {
   self.verify.file = await import(
    `../../../../../Commands/ButtonCommands/verify.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/verify.js`),
 },
};

export default self;
