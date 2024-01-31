const self = {
 autocompleteHandler: {
  reload: async () => {
   self.autocompleteHandler.file = await import(
    `../../../../../Events/BotEvents/interactionEvents/autocompleteHandler.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Events/BotEvents/interactionEvents/autocompleteHandler.js`),
 },
 buttonHandler: {
  reload: async () => {
   self.buttonHandler.file = await import(
    `../../../../../Events/BotEvents/interactionEvents/buttonHandler.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Events/BotEvents/interactionEvents/buttonHandler.js`),
 },
 commandHandler: {
  reload: async () => {
   self.commandHandler.file = await import(
    `../../../../../Events/BotEvents/interactionEvents/commandHandler.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Events/BotEvents/interactionEvents/commandHandler.js`),
 },
 contextCommandHandler: {
  reload: async () => {
   self.contextCommandHandler.file = await import(
    `../../../../../Events/BotEvents/interactionEvents/contextCommandHandler.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Events/BotEvents/interactionEvents/contextCommandHandler.js`),
 },
 interactionCreate: {
  reload: async () => {
   self.interactionCreate.file = await import(
    `../../../../../Events/BotEvents/interactionEvents/interactionCreate.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Events/BotEvents/interactionEvents/interactionCreate.js`),
 },
 modalHandler: {
  reload: async () => {
   self.modalHandler.file = await import(
    `../../../../../Events/BotEvents/interactionEvents/modalHandler.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Events/BotEvents/interactionEvents/modalHandler.js`),
 },
 selectHandler: {
  reload: async () => {
   self.selectHandler.file = await import(
    `../../../../../Events/BotEvents/interactionEvents/selectHandler.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Events/BotEvents/interactionEvents/selectHandler.js`),
 },
};

export default self;
