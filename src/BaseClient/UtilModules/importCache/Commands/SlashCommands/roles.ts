const self = {
 builders: {
  'button-roles': {
   reload: async () => {
    self.builders['button-roles'].file = await import(
     `../../../../../Commands/SlashCommands/roles/builders/button-roles.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/roles/builders/button-roles.js`),
  },
  'reaction-roles': {
   reload: async () => {
    self.builders['reaction-roles'].file = await import(
     `../../../../../Commands/SlashCommands/roles/builders/reaction-roles.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/roles/builders/reaction-roles.js`),
  },
 },
 create: {
  reload: async () => {
   self.create.file = await import(
    `../../../../../Commands/SlashCommands/roles/create.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/roles/create.js`),
 },
 delete: {
  reload: async () => {
   self.delete.file = await import(
    `../../../../../Commands/SlashCommands/roles/delete.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/roles/delete.js`),
 },
 edit: {
  reload: async () => {
   self.edit.file = await import(
    `../../../../../Commands/SlashCommands/roles/edit.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/roles/edit.js`),
 },
 give: {
  reload: async () => {
   self.give.file = await import(
    `../../../../../Commands/SlashCommands/roles/give.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/roles/give.js`),
 },
 info: {
  reload: async () => {
   self.info.file = await import(
    `../../../../../Commands/SlashCommands/roles/info.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/roles/info.js`),
 },
 members: {
  reload: async () => {
   self.members.file = await import(
    `../../../../../Commands/SlashCommands/roles/members.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/roles/members.js`),
 },
 take: {
  reload: async () => {
   self.take.file = await import(
    `../../../../../Commands/SlashCommands/roles/take.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/roles/take.js`),
 },
};

export default self;
