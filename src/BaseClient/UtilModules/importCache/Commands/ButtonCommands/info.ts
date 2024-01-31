const self = {
 basicPerms: {
  reload: async () => {
   self.basicPerms.file = await import(
    `../../../../../Commands/ButtonCommands/info/basicPerms.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/info/basicPerms.js`),
 },
 emojis: {
  reload: async () => {
   self.emojis.file = await import(
    `../../../../../Commands/ButtonCommands/info/emojis.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/info/emojis.js`),
 },
 features: {
  reload: async () => {
   self.features.file = await import(
    `../../../../../Commands/ButtonCommands/info/features.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/info/features.js`),
 },
 members: {
  reload: async () => {
   self.members.file = await import(
    `../../../../../Commands/ButtonCommands/info/members.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/info/members.js`),
 },
 roles: {
  reload: async () => {
   self.roles.file = await import(
    `../../../../../Commands/ButtonCommands/info/roles.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/info/roles.js`),
 },
 servers: {
  reload: async () => {
   self.servers.file = await import(
    `../../../../../Commands/ButtonCommands/info/servers.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/info/servers.js`),
 },
 stickers: {
  reload: async () => {
   self.stickers.file = await import(
    `../../../../../Commands/ButtonCommands/info/stickers.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/info/stickers.js`),
 },
};

export default self;
