const self = {
 view: {
  'custom-embeds': {
   reload: async () => {
    self.view['custom-embeds'].file = await import(
     `../../../../../Commands/AutocompleteCommands/embed-builder/view/custom-embeds.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/AutocompleteCommands/embed-builder/view/custom-embeds.js`
   ),
  },
 },
};

export default self;
