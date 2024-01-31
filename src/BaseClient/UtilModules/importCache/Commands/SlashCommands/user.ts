const self = {
 avatar: {
  reload: async () => {
   self.avatar.file = await import(
    `../../../../../Commands/SlashCommands/user/avatar.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/user/avatar.js`),
 },
 banner: {
  reload: async () => {
   self.banner.file = await import(
    `../../../../../Commands/SlashCommands/user/banner.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/user/banner.js`),
 },
 info: {
  reload: async () => {
   self.info.file = await import(
    `../../../../../Commands/SlashCommands/user/info.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/user/info.js`),
 },
};

export default self;
