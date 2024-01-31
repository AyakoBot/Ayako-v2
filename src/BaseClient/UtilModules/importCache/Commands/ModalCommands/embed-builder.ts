const self = {
 edit: {
  reload: async () => {
   self.edit.file = await import(
    `../../../../../Commands/ModalCommands/embed-builder/edit.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ModalCommands/embed-builder/edit.js`),
 },
 editor: {
  reload: async () => {
   self.editor.file = await import(
    `../../../../../Commands/ModalCommands/embed-builder/editor.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ModalCommands/embed-builder/editor.js`),
 },
 inheritCode: {
  reload: async () => {
   self.inheritCode.file = await import(
    `../../../../../Commands/ModalCommands/embed-builder/inheritCode.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ModalCommands/embed-builder/inheritCode.js`),
 },
 save: {
  reload: async () => {
   self.save.file = await import(
    `../../../../../Commands/ModalCommands/embed-builder/save.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ModalCommands/embed-builder/save.js`),
 },
};

export default self;
