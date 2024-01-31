const self = {
 create: {
  'from-file': {
   reload: async () => {
    self.create['from-file'].file = await import(
     `../../../../../Commands/AutocompleteCommands/stickers/create/from-file.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/AutocompleteCommands/stickers/create/from-file.js`),
  },
  'from-message': {
   reload: async () => {
    self.create['from-message'].file = await import(
     `../../../../../Commands/AutocompleteCommands/stickers/create/from-message.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Commands/AutocompleteCommands/stickers/create/from-message.js`
   ),
  },
 },
 edit: {
  description: {
   reload: async () => {
    self.edit.description.file = await import(
     `../../../../../Commands/AutocompleteCommands/stickers/edit/description.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/AutocompleteCommands/stickers/edit/description.js`),
  },
  emoji: {
   reload: async () => {
    self.edit.emoji.file = await import(
     `../../../../../Commands/AutocompleteCommands/stickers/edit/emoji.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/AutocompleteCommands/stickers/edit/emoji.js`),
  },
  name: {
   reload: async () => {
    self.edit.name.file = await import(
     `../../../../../Commands/AutocompleteCommands/stickers/edit/name.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/AutocompleteCommands/stickers/edit/name.js`),
  },
 },
 delete: {
  reload: async () => {
   self.delete.file = await import(
    `../../../../../Commands/AutocompleteCommands/stickers/delete.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/AutocompleteCommands/stickers/delete.js`),
 },
};

export default self;
