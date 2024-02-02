const self = {
 author: {
  reload: async () => {
   self.author.file = await import(
    `../../../../settingsHelpers/embedParsers/author.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/embedParsers/author.js`),
 },
 boolean: {
  reload: async () => {
   self.boolean.file = await import(
    `../../../../settingsHelpers/embedParsers/boolean.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/embedParsers/boolean.js`),
 },
 channel: {
  reload: async () => {
   self.channel.file = await import(
    `../../../../settingsHelpers/embedParsers/channel.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/embedParsers/channel.js`),
 },
 channels: {
  reload: async () => {
   self.channels.file = await import(
    `../../../../settingsHelpers/embedParsers/channels.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/embedParsers/channels.js`),
 },
 command: {
  reload: async () => {
   self.command.file = await import(
    `../../../../settingsHelpers/embedParsers/command.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/embedParsers/command.js`),
 },
 embed: {
  reload: async () => {
   self.embed.file = await import(
    `../../../../settingsHelpers/embedParsers/embed.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/embedParsers/embed.js`),
 },
 emote: {
  reload: async () => {
   self.emote.file = await import(
    `../../../../settingsHelpers/embedParsers/emote.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/embedParsers/emote.js`),
 },
 number: {
  reload: async () => {
   self.number.file = await import(
    `../../../../settingsHelpers/embedParsers/number.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/embedParsers/number.js`),
 },
 role: {
  reload: async () => {
   self.role.file = await import(
    `../../../../settingsHelpers/embedParsers/role.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/embedParsers/role.js`),
 },
 roles: {
  reload: async () => {
   self.roles.file = await import(
    `../../../../settingsHelpers/embedParsers/roles.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/embedParsers/roles.js`),
 },
 rules: {
  reload: async () => {
   self.rules.file = await import(
    `../../../../settingsHelpers/embedParsers/rules.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/embedParsers/rules.js`),
 },
 string: {
  reload: async () => {
   self.string.file = await import(
    `../../../../settingsHelpers/embedParsers/string.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/embedParsers/string.js`),
 },
 time: {
  reload: async () => {
   self.time.file = await import(
    `../../../../settingsHelpers/embedParsers/time.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/embedParsers/time.js`),
 },
 user: {
  reload: async () => {
   self.user.file = await import(
    `../../../../settingsHelpers/embedParsers/user.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/embedParsers/user.js`),
 },
 users: {
  reload: async () => {
   self.users.file = await import(
    `../../../../settingsHelpers/embedParsers/users.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../settingsHelpers/embedParsers/users.js`),
 },
};

export default self;
