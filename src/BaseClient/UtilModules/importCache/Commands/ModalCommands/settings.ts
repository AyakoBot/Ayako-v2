const self = {
 autoModRule: {
  duration: {
   reload: async () => {
    self.autoModRule.duration.file = await import(
     `../../../../../Commands/ModalCommands/settings/autoModRule/duration.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ModalCommands/settings/autoModRule/duration.js`),
  },
  string: {
   reload: async () => {
    self.autoModRule.string.file = await import(
     `../../../../../Commands/ModalCommands/settings/autoModRule/string.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ModalCommands/settings/autoModRule/string.js`),
  },
  strings: {
   reload: async () => {
    self.autoModRule.strings.file = await import(
     `../../../../../Commands/ModalCommands/settings/autoModRule/strings.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ModalCommands/settings/autoModRule/strings.js`),
  },
 },
 message: {
  reload: async () => {
   self.message.file = await import(
    `../../../../../Commands/ModalCommands/settings/message.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ModalCommands/settings/message.js`),
 },
 number: {
  reload: async () => {
   self.number.file = await import(
    `../../../../../Commands/ModalCommands/settings/number.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ModalCommands/settings/number.js`),
 },
 string: {
  reload: async () => {
   self.string.file = await import(
    `../../../../../Commands/ModalCommands/settings/string.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ModalCommands/settings/string.js`),
 },
 duration: {
  reload: async () => {
   self.duration.file = await import(
    `../../../../../Commands/ModalCommands/settings/duration.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ModalCommands/settings/duration.js`),
 },
 strings: {
  reload: async () => {
   self.strings.file = await import(
    `../../../../../Commands/ModalCommands/settings/strings.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ModalCommands/settings/strings.js`),
 },
};

export default self;
