const self = {
 threadCreate: {
  threadCreate: {
   reload: async () => {
    self.threadCreate.threadCreate.file = await import(
     `../../../../../Events/BotEvents/threadEvents/threadCreate/threadCreate.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/threadEvents/threadCreate/threadCreate.js`),
  },
 },
 threadDelete: {
  threadDelete: {
   reload: async () => {
    self.threadDelete.threadDelete.file = await import(
     `../../../../../Events/BotEvents/threadEvents/threadDelete/threadDelete.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/threadEvents/threadDelete/threadDelete.js`),
  },
 },
 threadMembersUpdate: {
  log: {
   reload: async () => {
    self.threadMembersUpdate.log.file = await import(
     `../../../../../Events/BotEvents/threadEvents/threadMembersUpdate/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/threadEvents/threadMembersUpdate/log.js`),
  },
  threadMembersUpdate: {
   reload: async () => {
    self.threadMembersUpdate.threadMembersUpdate.file = await import(
     `../../../../../Events/BotEvents/threadEvents/threadMembersUpdate/threadMembersUpdate.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/threadEvents/threadMembersUpdate/threadMembersUpdate.js`
   ),
  },
 },
 threadUpdate: {
  threadUpdate: {
   reload: async () => {
    self.threadUpdate.threadUpdate.file = await import(
     `../../../../../Events/BotEvents/threadEvents/threadUpdate/threadUpdate.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/threadEvents/threadUpdate/threadUpdate.js`),
  },
 },
};

export default self;
