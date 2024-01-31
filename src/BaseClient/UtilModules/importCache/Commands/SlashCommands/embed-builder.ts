const self = {
 view: {
  'custom-embeds': {
   reload: async () => {
    self.view['custom-embeds'].file = await import(
     `../../../../../Commands/SlashCommands/embed-builder/view/custom-embeds.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/embed-builder/view/custom-embeds.js`),
  },
  'from-message': {
   reload: async () => {
    self.view['from-message'].file = await import(
     `../../../../../Commands/SlashCommands/embed-builder/view/from-message.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/embed-builder/view/from-message.js`),
  },
 },
 create: {
  reload: async () => {
   self.create.file = await import(
    `../../../../../Commands/SlashCommands/embed-builder/create.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/embed-builder/create.js`),
 },
};

export default self;
