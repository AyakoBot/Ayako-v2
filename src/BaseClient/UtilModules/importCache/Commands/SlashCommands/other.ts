const self = {
 afk: {
  reload: async () => {
   self.afk.file = await import(
    `../../../../../Commands/SlashCommands/afk.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/afk.js`),
 },
 balance: {
  reload: async () => {
   self.balance.file = await import(
    `../../../../../Commands/SlashCommands/balance.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/balance.js`),
 },
 bypass: {
  reload: async () => {
   self.bypass.file = await import(
    `../../../../../Commands/SlashCommands/bypass.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/bypass.js`),
 },
 'custom-role': {
  reload: async () => {
   self['custom-role'].file = await import(
    `../../../../../Commands/SlashCommands/custom-role.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/custom-role.js`),
 },
 membercount: {
  reload: async () => {
   self.membercount.file = await import(
    `../../../../../Commands/SlashCommands/membercount.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/membercount.js`),
 },
 ping: {
  reload: async () => {
   self.ping.file = await import(
    `../../../../../Commands/SlashCommands/ping.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/ping.js`),
 },
 'self-roles': {
  reload: async () => {
   self['self-roles'].file = await import(
    `../../../../../Commands/SlashCommands/self-roles.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/self-roles.js`),
 },
 stp: {
  reload: async () => {
   self.stp.file = await import(
    `../../../../../Commands/SlashCommands/stp.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/stp.js`),
 },
 vote: {
  reload: async () => {
   self.vote.file = await import(
    `../../../../../Commands/SlashCommands/vote.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/vote.js`),
 },
 shop: {
  reload: async () => {
   self.shop.file = await import(
    `../../../../../Commands/SlashCommands/shop.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/shop.js`),
 },
};

export default self;
