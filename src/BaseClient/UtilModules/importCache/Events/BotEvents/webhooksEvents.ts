const self = {
 webhooksCreates: {
  log: {
   reload: async () => {
    self.webhooksCreates.log.file = await import(
     `../../../../../Events/BotEvents/webhooksEvents/webhooksCreates/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/webhooksEvents/webhooksCreates/log.js`),
  },
  webhooksCreates: {
   reload: async () => {
    self.webhooksCreates.webhooksCreates.file = await import(
     `../../../../../Events/BotEvents/webhooksEvents/webhooksCreates/webhooksCreates.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/webhooksEvents/webhooksCreates/webhooksCreates.js`
   ),
  },
 },
 webhooksDeletes: {
  log: {
   reload: async () => {
    self.webhooksDeletes.log.file = await import(
     `../../../../../Events/BotEvents/webhooksEvents/webhooksDeletes/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/webhooksEvents/webhooksDeletes/log.js`),
  },
  webhooksDeletes: {
   reload: async () => {
    self.webhooksDeletes.webhooksDeletes.file = await import(
     `../../../../../Events/BotEvents/webhooksEvents/webhooksDeletes/webhooksDeletes.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/webhooksEvents/webhooksDeletes/webhooksDeletes.js`
   ),
  },
 },
 webhooksUpdates: {
  log: {
   reload: async () => {
    self.webhooksUpdates.log.file = await import(
     `../../../../../Events/BotEvents/webhooksEvents/webhooksUpdates/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/webhooksEvents/webhooksUpdates/log.js`),
  },
  webhooksUpdates: {
   reload: async () => {
    self.webhooksUpdates.webhooksUpdates.file = await import(
     `../../../../../Events/BotEvents/webhooksEvents/webhooksUpdates/webhooksUpdates.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/webhooksEvents/webhooksUpdates/webhooksUpdates.js`
   ),
  },
 },
 webhookUpdate: {
  reload: async () => {
   self.webhookUpdate.file = await import(
    `../../../../../Events/BotEvents/webhooksEvents/webhookUpdate.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Events/BotEvents/webhooksEvents/webhookUpdate.js`),
 },
};

export default self;
