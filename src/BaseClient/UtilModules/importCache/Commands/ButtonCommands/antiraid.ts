const self = {
 print: {
  reload: async () => {
   self.print.file = await import(
    `../../../../../Commands/ButtonCommands/antiraid/print.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/antiraid/print.js`),
 },
 punish: {
  reload: async () => {
   self.punish.file = await import(
    `../../../../../Commands/ButtonCommands/antiraid/punish.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/antiraid/punish.js`),
 },
};

export default self;
