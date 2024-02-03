const self = {
 sync: {
  reload: async () => {
   self.sync.file = await import(
    `../../../../../Commands/ButtonCommands/rp/sync.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/rp/sync.js`),
 },
 toggle: {
  reload: async () => {
   self.toggle.file = await import(
    `../../../../../Commands/ButtonCommands/rp/toggle.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/rp/toggle.js`),
 },
 unblock: {
  reload: async () => {
   self.unblock.file = await import(
    `../../../../../Commands/ButtonCommands/rp/unblock.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/rp/unblock.js`),
 },
};

export default self;
