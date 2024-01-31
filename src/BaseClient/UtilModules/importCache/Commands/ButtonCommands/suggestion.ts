const self = {
 accept: {
  version: 0,
  reload: async () => {
   self.accept.file = await import(
    `../../../../../Commands/ButtonCommands/suggestion/accept.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/suggestion/accept.js`),
 },
 ban: {
  version: 0,
  reload: async () => {
   self.ban.file = await import(
    `../../../../../Commands/ButtonCommands/suggestion/ban.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/suggestion/ban.js`),
 },
 cross: {
  version: 0,
  reload: async () => {
   self.cross.file = await import(
    `../../../../../Commands/ButtonCommands/suggestion/cross.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/suggestion/cross.js`),
 },
 delete: {
  version: 0,
  reload: async () => {
   self.delete.file = await import(
    `../../../../../Commands/ButtonCommands/suggestion/delete.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/suggestion/delete.js`),
 },
 reject: {
  version: 0,
  reload: async () => {
   self.reject.file = await import(
    `../../../../../Commands/ButtonCommands/suggestion/reject.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/suggestion/reject.js`),
 },
 tick: {
  version: 0,
  reload: async () => {
   self.tick.file = await import(
    `../../../../../Commands/ButtonCommands/suggestion/tick.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/suggestion/tick.js`),
 },
 view: {
  version: 0,
  reload: async () => {
   self.view.file = await import(
    `../../../../../Commands/ButtonCommands/suggestion/view.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/suggestion/view.js`),
 },
};

export default self;
