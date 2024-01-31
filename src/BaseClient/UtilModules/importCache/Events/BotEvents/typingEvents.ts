const self = {
 log: {
  reload: async () => {
   self.log.file = await import(
    `../../../../../Events/BotEvents/typingEvents/log.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Events/BotEvents/typingEvents/log.js`),
 },
 typingStart: {
  reload: async () => {
   self.typingStart.file = await import(
    `../../../../../Events/BotEvents/typingEvents/typingStart/typingStart.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Events/BotEvents/typingEvents/typingStart.js`),
 },
};

export default self;
