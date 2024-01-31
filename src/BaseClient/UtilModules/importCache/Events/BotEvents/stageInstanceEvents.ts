const self = {
 stageInstanceCreate: {
  log: {
   reload: async () => {
    self.stageInstanceCreate.log.file = await import(
     `../../../../../Events/BotEvents/stageInstanceEvents/stageInstanceCreate/log.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/stageInstanceEvents/stageInstanceCreate/log.js`
   ),
  },
  stageInstanceCreate: {
   reload: async () => {
    self.stageInstanceCreate.stageInstanceCreate.file = await import(
     `../../../../../Events/BotEvents/stageInstanceEvents/stageInstanceCreate/stageInstanceCreate.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/stageInstanceEvents/stageInstanceCreate/stageInstanceCreate.js`
   ),
  },
 },
 stageInstanceDelete: {
  log: {
   reload: async () => {
    self.stageInstanceDelete.log.file = await import(
     `../../../../../Events/BotEvents/stageInstanceEvents/stageInstanceDelete/log.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/stageInstanceEvents/stageInstanceDelete/log.js`
   ),
  },
  stageInstanceDelete: {
   reload: async () => {
    self.stageInstanceDelete.stageInstanceDelete.file = await import(
     `../../../../../Events/BotEvents/stageInstanceEvents/stageInstanceDelete/stageInstanceDelete.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/stageInstanceEvents/stageInstanceDelete/stageInstanceDelete.js`
   ),
  },
 },
 stageInstanceUpdate: {
  log: {
   reload: async () => {
    self.stageInstanceUpdate.log.file = await import(
     `../../../../../Events/BotEvents/stageInstanceEvents/stageInstanceUpdate/log.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/stageInstanceEvents/stageInstanceUpdate/log.js`
   ),
  },
  stageInstanceUpdate: {
   reload: async () => {
    self.stageInstanceUpdate.stageInstanceUpdate.file = await import(
     `../../../../../Events/BotEvents/stageInstanceEvents/stageInstanceUpdate/stageInstanceUpdate.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/stageInstanceEvents/stageInstanceUpdate/stageInstanceUpdate.js`
   ),
  },
 },
};

export default self;
