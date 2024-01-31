const self = {
 bans: {
  reload: async () => {
   self.bans.file = await import(`../../../../cache/bot/bans.js?version=${Date.now()}`);
  },
  file: await import(`../../../../cache/bot/bans.js`),
 },
 channelBans: {
  reload: async () => {
   self.channelBans.file = await import(
    `../../../../cache/bot/channelBans.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../cache/bot/channelBans.js`),
 },
 deleteSuggestions: {
  reload: async () => {
   self.deleteSuggestions.file = await import(
    `../../../../cache/bot/deleteSuggestions.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../cache/bot/deleteSuggestions.js`),
 },
 deleteThreads: {
  reload: async () => {
   self.deleteThreads.file = await import(
    `../../../../cache/bot/deleteThreads.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../cache/bot/deleteThreads.js`),
 },
 disboardBumpReminders: {
  reload: async () => {
   self.disboardBumpReminders.file = await import(
    `../../../../cache/bot/disboardBumpReminders.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../cache/bot/disboardBumpReminders.js`),
 },
 giveawayClaimTimeout: {
  reload: async () => {
   selfClaimTimeout.file = await import(
    `../../../../cache/bot/giveawayClaimTimeout.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../cache/bot/giveawayClaimTimeout.js`),
 },
 giveaways: {
  reload: async () => {
   selfs.file = await import(`../../../../cache/bot/giveaways.js?version=${Date.now()}`);
  },
  file: await import(`../../../../cache/bot/giveaways.js`),
 },
 mutes: {
  reload: async () => {
   self.mutes.file = await import(`../../../../cache/bot/mutes.js?version=${Date.now()}`);
  },
  file: await import(`../../../../cache/bot/mutes.js`),
 },
 reminders: {
  reload: async () => {
   selfs.file = await import(`../../../../cache/bot/reminders.js?version=${Date.now()}`);
  },
  file: await import(`../../../../cache/bot/reminders.js`),
 },
 stickyTimeouts: {
  reload: async () => {
   self.stickyTimeouts.file = await import(
    `../../../../cache/bot/stickyTimeouts.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../cache/bot/stickyTimeouts.js`),
 },
 vcDeleteTimeout: {
  reload: async () => {
   self.vcDeleteTimeout.file = await import(
    `../../../../cache/bot/vcDeleteTimeout.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../cache/bot/vcDeleteTimeout.js`),
 },
 votes: {
  reload: async () => {
   self.votes.file = await import(`../../../../cache/bot/votes.js?version=${Date.now()}`);
  },
  file: await import(`../../../../cache/bot/votes.js`),
 },
};

export default self;
