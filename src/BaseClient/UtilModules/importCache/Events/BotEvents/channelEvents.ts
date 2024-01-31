const self = {
 channelCreate: {
  channelCreate: {
   reload: async () => {
    self.channelCreate.channelCreate.file = await import(
     `../../../../../Events/BotEvents/channelEvents/channelCreate.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/channelEvents/channelCreate/channelCreate.js`
   ),
  },
  log: {
   reload: async () => {
    self.channelCreate.log.file = await import(
     `../../../../../Events/BotEvents/channelEvents/channelCreate/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/channelEvents/channelCreate/log.js`),
  },
 },
 channelDelete: {
  channelDelete: {
   reload: async () => {
    self.channelDelete.channelDelete.file = await import(
     `../../../../../Events/BotEvents/channelEvents/channelDelete.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/channelEvents/channelDelete/channelDelete.js`
   ),
  },
  log: {
   reload: async () => {
    self.channelDelete.log.file = await import(
     `../../../../../Events/BotEvents/channelEvents/channelDelete/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/channelEvents/channelDelete/log.js`),
  },
 },
 channelPinsUpdate: {
  channelPinsCreate: {
   channelPinsCreate: {
    reload: async () => {
     self.channelPinsUpdate.channelPinsCreate.channelPinsCreate.file = await import(
      `../../../../../Events/BotEvents/channelEvents/channelPinsUpdate/channelPinsCreate/channelPinsCreate.js?version=${Date.now()}`
     );
    },
    file: await import(
     `../../../../../Events/BotEvents/channelEvents/channelPinsUpdate/channelPinsCreate/channelPinsCreate.js`
    ),
   },
   log: {
    reload: async () => {
     self.channelPinsUpdate.channelPinsCreate.log.file = await import(
      `../../../../../Events/BotEvents/channelEvents/channelPinsUpdate/channelPinsCreate/log.js?version=${Date.now()}`
     );
    },
    file: await import(
     `../../../../../Events/BotEvents/channelEvents/channelPinsUpdate/channelPinsCreate/log.js`
    ),
   },
  },
  channelPinsDelete: {
   channelPinsDelete: {
    reload: async () => {
     self.channelPinsUpdate.channelPinsDelete.channelPinsDelete.file = await import(
      `../../../../../Events/BotEvents/channelEvents/channelPinsUpdate/channelPinsDelete/channelPinsDelete.js?version=${Date.now()}`
     );
    },
    file: await import(
     `../../../../../Events/BotEvents/channelEvents/channelPinsUpdate/channelPinsDelete/channelPinsDelete.js`
    ),
   },
   log: {
    reload: async () => {
     self.channelPinsUpdate.channelPinsDelete.log.file = await import(
      `../../../../../Events/BotEvents/channelEvents/channelPinsUpdate/channelPinsDelete/log.js?version=${Date.now()}`
     );
    },
    file: await import(
     `../../../../../Events/BotEvents/channelEvents/channelPinsUpdate/channelPinsDelete/log.js`
    ),
   },
  },
  channelPinsUpdate: {
   reload: async () => {
    self.channelPinsUpdate.channelPinsUpdate.file = await import(
     `../../../../../Events/BotEvents/channelEvents/channelPinsUpdate.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/channelEvents/channelPinsUpdate/channelPinsUpdate.js`
   ),
  },
 },
 channelUpdate: {},
};

export default self;
