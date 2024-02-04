const self = {
 Language: {
  reload: async () => {
   self.Language.file = await import(`../../../Other/language.js?version=${Date.now()}`);
  },
  file: await import(`../../../Other/language.js`),
 },
 constants: {
  reload: async () => {
   self.constants.file = await import(`../../../Other/constants.js?version=${Date.now()}`);
  },
  file: await import(`../../../Other/constants.js`),
 },
 firstChannelInteraction: {
  reload: async () => {
   self.firstChannelInteraction.file = await import(
    `../../../Other/firstChannelInteraction.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../Other/firstChannelInteraction.js`),
 },
 firstGuildInteraction: {
  reload: async () => {
   self.firstGuildInteraction.file = await import(
    `../../../Other/firstGuildInteraction.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../Other/firstGuildInteraction.js`),
 },
};

export default self;
