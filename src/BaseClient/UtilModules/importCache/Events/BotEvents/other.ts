const self = {
 SIGINT: {
  reload: async () => {
   self.SIGINT.file = await import(
    `../../../../../Events/BotEvents/SIGINT.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Events/BotEvents/SIGINT.js`),
 },
 baseEventHandler: {
  reload: async () => {
   self.baseEventHandler.file = await import(
    `../../../../../Events/BotEvents/baseEventHandler.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Events/BotEvents/baseEventHandler.js`),
 },
 debug: {
  reload: async () => {
   self.debug.file = await import(`../../../../../Events/BotEvents/debug.js?version=${Date.now()}`);
  },
  file: await import(`../../../../../Events/BotEvents/debug.js`),
 },
 error: {
  reload: async () => {
   self.error.file = await import(`../../../../../Events/BotEvents/error.js?version=${Date.now()}`);
  },
  file: await import(`../../../../../Events/BotEvents/error.js`),
 },
 shardDisconnect: {
  reload: async () => {
   self.shardDisconnect.file = await import(
    `../../../../../Events/BotEvents/shardDisconnect.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Events/BotEvents/shardDisconnect.js`),
 },
 shardError: {
  reload: async () => {
   self.shardError.file = await import(
    `../../../../../Events/BotEvents/shardError.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Events/BotEvents/shardError.js`),
 },
 shardReady: {
  reload: async () => {
   self.shardReady.file = await import(
    `../../../../../Events/BotEvents/shardReady.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Events/BotEvents/shardReady.js`),
 },
 shardReconnecting: {
  reload: async () => {
   self.shardReconnecting.file = await import(
    `../../../../../Events/BotEvents/shardReconnecting.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Events/BotEvents/shardReconnecting.js`),
 },
 shardResume: {
  reload: async () => {
   self.shardResume.file = await import(
    `../../../../../Events/BotEvents/shardResume.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Events/BotEvents/shardResume.js`),
 },
 warn: {
  reload: async () => {
   self.warn.file = await import(`../../../../../Events/BotEvents/warn.js?version=${Date.now()}`);
  },
  file: await import(`../../../../../Events/BotEvents/warn.js`),
 },
};

export default self;
