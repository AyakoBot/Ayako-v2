const self = {
 reload: async () => {
  self.file = await import(`../../../../requestHandler/commands.js?version=${Date.now()}`);
 },
 file: await import(`../../../../requestHandler/commands.js`),

 getGlobalCommands: {
  reload: async () => {
   self.getGlobalCommands.file = await import(
    `../../../../requestHandler/commands/getGlobalCommands.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/commands/getGlobalCommands.js`),
 },
 createGlobalCommand: {
  reload: async () => {
   self.createGlobalCommand.file = await import(
    `../../../../requestHandler/commands/createGlobalCommand.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/commands/createGlobalCommand.js`),
 },
 getGlobalCommand: {
  reload: async () => {
   self.getGlobalCommand.file = await import(
    `../../../../requestHandler/commands/getGlobalCommand.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/commands/getGlobalCommand.js`),
 },
 editGlobalCommand: {
  reload: async () => {
   self.editGlobalCommand.file = await import(
    `../../../../requestHandler/commands/editGlobalCommand.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/commands/editGlobalCommand.js`),
 },
 deleteGlobalCommand: {
  reload: async () => {
   self.deleteGlobalCommand.file = await import(
    `../../../../requestHandler/commands/deleteGlobalCommand.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/commands/deleteGlobalCommand.js`),
 },
 bulkOverwriteGlobalCommands: {
  reload: async () => {
   self.bulkOverwriteGlobalCommands.file = await import(
    `../../../../requestHandler/commands/bulkOverwriteGlobalCommands.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/commands/bulkOverwriteGlobalCommands.js`),
 },
 getGuildCommands: {
  reload: async () => {
   self.getGuildCommands.file = await import(
    `../../../../requestHandler/commands/getGuildCommands.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/commands/getGuildCommands.js`),
 },
 createGuildCommand: {
  reload: async () => {
   self.createGuildCommand.file = await import(
    `../../../../requestHandler/commands/createGuildCommand.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/commands/createGuildCommand.js`),
 },
 getGuildCommand: {
  reload: async () => {
   self.getGuildCommand.file = await import(
    `../../../../requestHandler/commands/getGuildCommand.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/commands/getGuildCommand.js`),
 },
 editGuildCommand: {
  reload: async () => {
   self.editGuildCommand.file = await import(
    `../../../../requestHandler/commands/editGuildCommand.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/commands/editGuildCommand.js`),
 },
 deleteGuildCommand: {
  reload: async () => {
   self.deleteGuildCommand.file = await import(
    `../../../../requestHandler/commands/deleteGuildCommand.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/commands/deleteGuildCommand.js`),
 },
 bulkOverwriteGuildCommands: {
  reload: async () => {
   self.bulkOverwriteGuildCommands.file = await import(
    `../../../../requestHandler/commands/bulkOverwriteGuildCommands.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/commands/bulkOverwriteGuildCommands.js`),
 },
 getGuildCommandPermissions: {
  reload: async () => {
   self.getGuildCommandPermissions.file = await import(
    `../../../../requestHandler/commands/getGuildCommandPermissions.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/commands/getGuildCommandPermissions.js`),
 },
 getGuildCommandsPermissions: {
  reload: async () => {
   self.getGuildCommandsPermissions.file = await import(
    `../../../../requestHandler/commands/getGuildCommandsPermissions.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/commands/getGuildCommandsPermissions.js`),
 },
 editGuildCommandPermissions: {
  reload: async () => {
   self.editGuildCommandPermissions.file = await import(
    `../../../../requestHandler/commands/editGuildCommandPermissions.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/commands/editGuildCommandPermissions.js`),
 },
};

export default self;
