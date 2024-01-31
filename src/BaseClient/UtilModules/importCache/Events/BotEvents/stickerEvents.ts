const self = {
 stickerCreate: {
  log: {
   reload: async () => {
    self.stickerCreate.log.file = await import(
     `../../../../../Events/BotEvents/stickerEvents/stickerCreate/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/stickerEvents/stickerCreate/log.js`),
  },
  stickerCreate: {
   reload: async () => {
    self.stickerCreate.stickerCreate.file = await import(
     `../../../../../Events/BotEvents/stickerEvents/stickerCreate/stickerCreate.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/stickerEvents/stickerCreate/stickerCreate.js`
   ),
  },
 },
 stickerDelete: {
  log: {
   reload: async () => {
    self.stickerDelete.log.file = await import(
     `../../../../../Events/BotEvents/stickerEvents/stickerDelete/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/stickerEvents/stickerDelete/log.js`),
  },
  stickerDelete: {
   reload: async () => {
    self.stickerDelete.stickerDelete.file = await import(
     `../../../../../Events/BotEvents/stickerEvents/stickerDelete/stickerDelete.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/stickerEvents/stickerDelete/stickerDelete.js`
   ),
  },
 },
 stickerUpdate: {
  log: {
   reload: async () => {
    self.stickerUpdate.log.file = await import(
     `../../../../../Events/BotEvents/stickerEvents/stickerUpdate/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/stickerEvents/stickerUpdate/log.js`),
  },
  stickerUpdate: {
   reload: async () => {
    self.stickerUpdate.stickerUpdate.file = await import(
     `../../../../../Events/BotEvents/stickerEvents/stickerUpdate/stickerUpdate.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/stickerEvents/stickerUpdate/stickerUpdate.js`
   ),
  },
 },
};

export default self;
