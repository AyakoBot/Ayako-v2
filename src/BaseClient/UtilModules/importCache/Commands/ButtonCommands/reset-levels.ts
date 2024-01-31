const self = {
 confirm: {
  version: 0,
  reload: async () => {
   self.confirm.file = await import(
    `../../../../../Commands/ButtonCommands/reset-levels/confirm.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/reset-levels/confirm.js`),
 },
 reject: {
  version: 0,
  reload: async () => {
   self.reject.file = await import(
    `../../../../../Commands/ButtonCommands/reset-levels/reject.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/reset-levels/reject.js`),
 },
};

export default self;
