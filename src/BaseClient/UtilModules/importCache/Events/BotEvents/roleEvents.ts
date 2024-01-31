const self = {
 roleCreate: {
  log: {
   reload: async () => {
    self.roleCreate.log.file = await import(
     `../../../../../Events/BotEvents/roleEvents/roleCreate/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/roleEvents/roleCreate/log.js`),
  },
  roleCreate: {
   reload: async () => {
    self.roleCreate.roleCreate.file = await import(
     `../../../../../Events/BotEvents/roleEvents/roleCreate/roleCreate.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/roleEvents/roleCreate/roleCreate.js`),
  },
 },
 roleDelete: {
  log: {
   reload: async () => {
    self.roleDelete.log.file = await import(
     `../../../../../Events/BotEvents/roleEvents/roleDelete/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/roleEvents/roleDelete/log.js`),
  },
  roleDelete: {
   reload: async () => {
    self.roleDelete.roleDelete.file = await import(
     `../../../../../Events/BotEvents/roleEvents/roleDelete/roleDelete.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/roleEvents/roleDelete/roleDelete.js`),
  },
 },
 roleUpdate: {
  log: {
   reload: async () => {
    self.roleUpdate.log.file = await import(
     `../../../../../Events/BotEvents/roleEvents/roleUpdate/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/roleEvents/roleUpdate/log.js`),
  },
  roleUpdate: {
   reload: async () => {
    self.roleUpdate.roleUpdate.file = await import(
     `../../../../../Events/BotEvents/roleEvents/roleUpdate/roleUpdate.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/roleEvents/roleUpdate/roleUpdate.js`),
  },
 },
};

export default self;
