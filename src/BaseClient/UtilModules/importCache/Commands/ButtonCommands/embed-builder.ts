const self = {
 create: {
  boolean: {
   reload: async () => {
    self.create.boolean.file = await import(
     `../../../../../Commands/ButtonCommands/antiraid/embed-builder/boolean.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/embed-builder/create/boolean.js`),
  },
  delete: {
   reload: async () => {
    self.create.delete.file = await import(
     `../../../../../Commands/ButtonCommands/antiraid/embed-builder/delete.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/embed-builder/create/delete.js`),
  },
  string: {
   reload: async () => {
    self.create.string.file = await import(
     `../../../../../Commands/ButtonCommands/antiraid/embed-builder/string.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/embed-builder/create/string.js`),
  },
 },
 back: {
  reload: async () => {
   self.back.file = await import(
    `../../../../../Commands/ButtonCommands/antiraid/embed-builder/back.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/embed-builder/back.js`),
 },
 deleteCustom: {
  reload: async () => {
   self.deleteCustom.file = await import(
    `../../../../../Commands/ButtonCommands/antiraid/embed-builder/deleteCustom.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/embed-builder/deleteCustom.js`),
 },
 edit: {
  reload: async () => {
   self.edit.file = await import(
    `../../../../../Commands/ButtonCommands/antiraid/embed-builder/edit.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/embed-builder/edit.js`),
 },
 inheritCustom: {
  reload: async () => {
   self.inheritCustom.file = await import(
    `../../../../../Commands/ButtonCommands/antiraid/embed-builder/inheritCustom.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/embed-builder/inheritCustom.js`),
 },
 save: {
  reload: async () => {
   self.save.file = await import(
    `../../../../../Commands/ButtonCommands/antiraid/embed-builder/save.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/embed-builder/save.js`),
 },
 send: {
  reload: async () => {
   self.send.file = await import(
    `../../../../../Commands/ButtonCommands/antiraid/embed-builder/send.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/embed-builder/send.js`),
 },
 startOver: {
  reload: async () => {
   self.startOver.file = await import(
    `../../../../../Commands/ButtonCommands/antiraid/embed-builder/startOver.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/embed-builder/startOver.js`),
 },
};

export default self;
