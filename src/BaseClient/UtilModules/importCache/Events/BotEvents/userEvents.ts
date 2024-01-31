const self = {
 log: {
  reload: async () => {
   self.log.file = await import(
    `../../../../../Events/BotEvents/userEvents/log.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Events/BotEvents/userEvents/log.js`),
 },
 userUpdate: {
  reload: async () => {
   self.userUpdate.file = await import(
    `../../../../../Events/BotEvents/userEvents/userUpdate/userUpdate.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Events/BotEvents/userEvents/userUpdate.js`),
 },
};

export default self;
