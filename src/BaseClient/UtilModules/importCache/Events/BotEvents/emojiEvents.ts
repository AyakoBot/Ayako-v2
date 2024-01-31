const self = {
 emojiCreate: {
  emojiCreate: {
   reload: async () => {
    self.emojiCreate.emojiCreate.file = await import(
     `../../../../../Events/BotEvents/emojiEvents/emojiCreate.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/emojiEvents/emojiCreate/emojiCreate.js`),
  },
  log: {
   reload: async () => {
    self.emojiCreate.log.file = await import(
     `../../../../../Events/BotEvents/emojiEvents/emojiCreate/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/emojiEvents/emojiCreate/log.js`),
  },
 },
 emojiDelete: {
  emojiDelete: {
   reload: async () => {
    self.emojiDelete.emojiDelete.file = await import(
     `../../../../../Events/BotEvents/emojiEvents/emojiDelete.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/emojiEvents/emojiDelete/emojiDelete.js`),
  },
  log: {
   reload: async () => {
    self.emojiDelete.log.file = await import(
     `../../../../../Events/BotEvents/emojiEvents/emojiDelete/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/emojiEvents/emojiDelete/log.js`),
  },
 },
 emojiUpdate: {
  emojiUpdate: {
   reload: async () => {
    self.emojiUpdate.emojiUpdate.file = await import(
     `../../../../../Events/BotEvents/emojiEvents/emojiUpdate.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/emojiEvents/emojiUpdate/emojiUpdate.js`),
  },
  log: {
   reload: async () => {
    self.emojiUpdate.log.file = await import(
     `../../../../../Events/BotEvents/emojiEvents/emojiUpdate/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/emojiEvents/emojiUpdate/log.js`),
  },
 },
};

export default self;
