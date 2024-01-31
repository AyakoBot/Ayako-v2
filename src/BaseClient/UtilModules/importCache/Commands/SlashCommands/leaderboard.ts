const self = {
 global: {
  reload: async () => {
   self.global.file = await import(
    `../../../../../Commands/SlashCommands/leaderboard/global.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/leaderboard/global.js`),
 },
 nitro: {
  reload: async () => {
   self.nitro.file = await import(
    `../../../../../Commands/SlashCommands/leaderboard/nitro.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/leaderboard/nitro.js`),
 },
 server: {
  reload: async () => {
   self.server.file = await import(
    `../../../../../Commands/SlashCommands/leaderboard/server.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/leaderboard/server.js`),
 },
};

export default self;
