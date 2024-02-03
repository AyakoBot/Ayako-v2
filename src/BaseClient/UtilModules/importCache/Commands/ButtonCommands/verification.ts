const self = {
 enterCode: {
  reload: async () => {
   self.enterCode.file = await import(
    `../../../../../Commands/ButtonCommands/verification/enterCode.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/verification/enterCode.js`),
 },
 verify: {
  reload: async () => {
   self.verify.file = await import(
    `../../../../../Commands/ButtonCommands/verification/verify.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/verification/verify.js`),
 },
};

export default self;
