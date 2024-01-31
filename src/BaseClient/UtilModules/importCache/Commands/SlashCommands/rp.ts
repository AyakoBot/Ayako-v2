const self = {
 block: {
  reload: async () => {
   self.block.file = await import(
    `../../../../../Commands/SlashCommands/rp/block.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/rp/block.js`),
 },
 blocked: {
  reload: async () => {
   self.blocked.file = await import(
    `../../../../../Commands/SlashCommands/rp/blocked.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/rp/blocked.js`),
 },
 manager: {
  reload: async () => {
   self.manager.file = await import(
    `../../../../../Commands/SlashCommands/rp/manager.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/rp/manager.js`),
 },
 unblock: {
  reload: async () => {
   self.unblock.file = await import(
    `../../../../../Commands/SlashCommands/rp/unblock.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/rp/unblock.js`),
 },
};

export default self;
