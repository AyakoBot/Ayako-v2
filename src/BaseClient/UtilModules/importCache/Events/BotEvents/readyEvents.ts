const self = {
 startupTasks: {
  reload: async () => {
   self.startupTasks.file = await import(
    `../../../../../Events/BotEvents/readyEvents/startupTasks.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Events/BotEvents/readyEvents/startupTasks.js`),

  cache: {
   reload: async () => {
    self.startupTasks.cache.file = await import(
     `../../../../../Events/BotEvents/readyEvents/startupTasks/cache.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/readyEvents/startupTasks/cache.js`),
  },
  customAPIsHandler: {
   reload: async () => {
    self.startupTasks.customAPIsHandler.file = await import(
     `../../../../../Events/BotEvents/readyEvents/startupTasks/customAPIsHandler.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/readyEvents/startupTasks/customAPIsHandler.js`
   ),
  },
  customBotCommands: {
   reload: async () => {
    self.startupTasks.customBotCommands.file = await import(
     `../../../../../Events/BotEvents/readyEvents/startupTasks/customBotCommands.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/readyEvents/startupTasks/customBotCommands.js`
   ),
  },
  separators: {
   reload: async () => {
    self.startupTasks.separators.file = await import(
     `../../../../../Events/BotEvents/readyEvents/startupTasks/separators.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/readyEvents/startupTasks/separators.js`),
  },
 },
 timedFiles: {
  antivirusBlocklistCacher: {
   reload: async () => {
    self.timedFiles.antivirusBlocklistCacher.file = await import(
     `../../../../../Events/BotEvents/readyEvents/timedFiles/antivirusBlocklistCacher.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/readyEvents/timedFiles/antivirusBlocklistCacher.js`
   ),
  },
  expiry: {
   reload: async () => {
    self.timedFiles.expiry.file = await import(
     `../../../../../Events/BotEvents/readyEvents/timedFiles/expiry.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/readyEvents/timedFiles/expiry.js`),
  },
  nitroHandler: {
   reload: async () => {
    self.timedFiles.nitroHandler.file = await import(
     `../../../../../Events/BotEvents/readyEvents/timedFiles/nitroHandler.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/readyEvents/timedFiles/nitroHandler.js`),
  },
  separators: {
   reload: async () => {
    self.timedFiles.separators.file = await import(
     `../../../../../Events/BotEvents/readyEvents/timedFiles/separators.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/readyEvents/timedFiles/separators.js`),
  },
  stats: {
   reload: async () => {
    self.timedFiles.stats.file = await import(
     `../../../../../Events/BotEvents/readyEvents/timedFiles/stats.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/readyEvents/timedFiles/stats.js`),
  },
  timedManager: {
   reload: async () => {
    self.timedFiles.timedManager.file = await import(
     `../../../../../Events/BotEvents/readyEvents/timedFiles/timedManager.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/readyEvents/timedFiles/timedManager.js`),
  },
  verification: {
   reload: async () => {
    self.timedFiles.verification.file = await import(
     `../../../../../Events/BotEvents/readyEvents/timedFiles/verification.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/readyEvents/timedFiles/verification.js`),
  },
  websiteFetcher: {
   reload: async () => {
    self.timedFiles.websiteFetcher.file = await import(
     `../../../../../Events/BotEvents/readyEvents/timedFiles/websiteFetcher.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/readyEvents/timedFiles/websiteFetcher.js`),
  },
 },
 ready: {
  reload: async () => {
   self.ready.file = await import(
    `../../../../../Events/BotEvents/readyEvents/ready.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Events/BotEvents/readyEvents/ready.js`),
 },
};

export default self;
