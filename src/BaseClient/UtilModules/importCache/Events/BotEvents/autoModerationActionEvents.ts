const self = {
 autoModerationActionExecution: {
  reload: async () => {
   self.autoModerationActionExecution.file = await import(
    `../../../../../Events/BotEvents/autoModerationActionEvents/autoModerationActionExecution.js?version=${Date.now()}`
   );
  },
  file: await import(
   `../../../../../Events/BotEvents/autoModerationActionEvents/autoModerationActionExecution.js`
  ),
 },
 censor: {
  reload: async () => {
   self.censor.file = await import(
    `../../../../../Events/BotEvents/autoModerationActionEvents/censor.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Events/BotEvents/autoModerationActionEvents/censor.js`),
 },
 invites: {
  reload: async () => {
   self.invites.file = await import(
    `../../../../../Events/BotEvents/autoModerationActionEvents/invites.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Events/BotEvents/autoModerationActionEvents/invites.js`),
 },
 log: {
  reload: async () => {
   self.log.file = await import(
    `../../../../../Events/BotEvents/autoModerationActionEvents/log.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Events/BotEvents/autoModerationActionEvents/log.js`),
 },
 wordscraper: {
  reload: async () => {
   self.wordscraper.file = await import(
    `../../../../../Events/BotEvents/autoModerationActionEvents/wordscraper.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Events/BotEvents/autoModerationActionEvents/wordscraper.js`),
 },
};

export default self;
