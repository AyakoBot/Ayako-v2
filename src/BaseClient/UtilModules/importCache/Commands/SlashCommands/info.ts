const self = {
 badges: {
  reload: async () => {
   self.badges.file = await import(
    `../../../../../Commands/SlashCommands/info/badges.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/info/badges.js`),
 },
 bot: {
  reload: async () => {
   self.bot.file = await import(
    `../../../../../Commands/SlashCommands/info/bot.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/info/bot.js`),
 },
 channel: {
  reload: async () => {
   self.channel.file = await import(
    `../../../../../Commands/SlashCommands/info/channel.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/info/channel.js`),
 },
 emoji: {
  reload: async () => {
   self.emoji.file = await import(
    `../../../../../Commands/SlashCommands/info/emoji.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/info/emoji.js`),
 },
 invite: {
  reload: async () => {
   self.invite.file = await import(
    `../../../../../Commands/SlashCommands/info/invite.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/info/invite.js`),
 },
 role: {
  reload: async () => {
   self.role.file = await import(
    `../../../../../Commands/SlashCommands/info/role.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/info/role.js`),
 },
 server: {
  reload: async () => {
   self.server.file = await import(
    `../../../../../Commands/SlashCommands/info/server.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/info/server.js`),
 },
 servers: {
  reload: async () => {
   self.servers.file = await import(
    `../../../../../Commands/SlashCommands/info/servers.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/info/servers.js`),
 },
 sticker: {
  reload: async () => {
   self.sticker.file = await import(
    `../../../../../Commands/SlashCommands/info/sticker.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/info/sticker.js`),
 },
 user: {
  reload: async () => {
   self.user.file = await import(
    `../../../../../Commands/SlashCommands/info/user.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/info/user.js`),
 },
};

export default self;
