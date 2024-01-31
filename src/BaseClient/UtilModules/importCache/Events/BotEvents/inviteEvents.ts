const self = {
 inviteCreate: {
  inviteCreate: {
   reload: async () => {
    self.inviteCreate.inviteCreate.file = await import(
     `../../../../../Events/BotEvents/inviteEvents/inviteCreate.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/inviteEvents/inviteCreate/inviteCreate.js`),
  },
  log: {
   reload: async () => {
    self.inviteCreate.log.file = await import(
     `../../../../../Events/BotEvents/inviteEvents/inviteCreate/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/inviteEvents/inviteCreate/log.js`),
  },
 },
 inviteDelete: {
  inviteDelete: {
   reload: async () => {
    self.inviteDelete.inviteDelete.file = await import(
     `../../../../../Events/BotEvents/inviteEvents/inviteDelete.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/inviteEvents/inviteDelete/inviteDelete.js`),
  },
  log: {
   reload: async () => {
    self.inviteDelete.log.file = await import(
     `../../../../../Events/BotEvents/inviteEvents/inviteDelete/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/inviteEvents/inviteDelete/log.js`),
  },
 },
};

export default self;
