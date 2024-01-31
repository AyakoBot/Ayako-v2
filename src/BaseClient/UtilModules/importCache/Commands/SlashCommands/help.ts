const self = {
 automation: {
  reload: async () => {
   self.automation.file = await import(
    `../../../../../Commands/SlashCommands/help/automation.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/help/automation.js`),
 },
 channels: {
  reload: async () => {
   self.channels.file = await import(
    `../../../../../Commands/SlashCommands/help/channels.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/help/channels.js`),
 },
 command: {
  reload: async () => {
   self.command.file = await import(
    `../../../../../Commands/SlashCommands/help/command.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/help/command.js`),
 },
 fun: {
  reload: async () => {
   self.fun.file = await import(
    `../../../../../Commands/SlashCommands/help/fun.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/help/fun.js`),
 },
 info: {
  reload: async () => {
   self.info.file = await import(
    `../../../../../Commands/SlashCommands/help/info.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/help/info.js`),
 },
 leveling: {
  reload: async () => {
   self.leveling.file = await import(
    `../../../../../Commands/SlashCommands/help/leveling.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/help/leveling.js`),
 },
 list: {
  reload: async () => {
   self.list.file = await import(
    `../../../../../Commands/SlashCommands/help/list.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/help/list.js`),
 },
 moderation: {
  reload: async () => {
   self.moderation.file = await import(
    `../../../../../Commands/SlashCommands/help/moderation.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/help/moderation.js`),
 },
 nitro: {
  reload: async () => {
   self.nitro.file = await import(
    `../../../../../Commands/SlashCommands/help/nitro.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/help/nitro.js`),
 },
 roles: {
  reload: async () => {
   self.roles.file = await import(
    `../../../../../Commands/SlashCommands/help/roles.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/help/roles.js`),
 },
 shop: {
  reload: async () => {
   self.shop.file = await import(
    `../../../../../Commands/SlashCommands/help/shop.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/help/shop.js`),
 },
 utility: {
  reload: async () => {
   self.utility.file = await import(
    `../../../../../Commands/SlashCommands/help/utility.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/help/utility.js`),
 },
 vote: {
  reload: async () => {
   self.vote.file = await import(
    `../../../../../Commands/SlashCommands/help/vote.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/help/vote.js`),
 },
};

export default self;
