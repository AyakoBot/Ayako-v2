const self = {
 reload: async () => {
  self.file = await import(`../../../../requestHandler/users.js?version=${Date.now()}`);
 },
 file: await import(`../../../../requestHandler/users.js`),

 get: {
  reload: async () => {
   self.get.file = await import(`../../../../requestHandler/users/get.js?version=${Date.now()}`);
  },
  file: await import(`../../../../requestHandler/users/get.js`),
 },
 getCurrent: {
  reload: async () => {
   self.getCurrent.file = await import(
    `../../../../requestHandler/users/getCurrent.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/users/getCurrent.js`),
 },
 getGuilds: {
  reload: async () => {
   self.getGuilds.file = await import(
    `../../../../requestHandler/users/getGuilds.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/users/getGuilds.js`),
 },
 leaveGuild: {
  reload: async () => {
   self.leaveGuild.file = await import(
    `../../../../requestHandler/users/leaveGuild.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/users/leaveGuild.js`),
 },
 edit: {
  reload: async () => {
   self.edit.file = await import(`../../../../requestHandler/users/edit.js?version=${Date.now()}`);
  },
  file: await import(`../../../../requestHandler/users/edit.js`),
 },
 editCurrentGuildMember: {
  reload: async () => {
   self.editCurrentGuildMember.file = await import(
    `../../../../requestHandler/users/editCurrentGuildMember.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/users/editCurrentGuildMember.js`),
 },
 createDM: {
  reload: async () => {
   self.createDM.file = await import(
    `../../../../requestHandler/users/createDM.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/users/createDM.js`),
 },
 getCurrentConnections: {
  reload: async () => {
   self.getCurrentConnections.file = await import(
    `../../../../requestHandler/users/getCurrentConnections.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/users/getCurrentConnections.js`),
 },
 getApplicationRoleConnection: {
  reload: async () => {
   self.getApplicationRoleConnection.file = await import(
    `../../../../requestHandler/users/getApplicationRoleConnection.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/users/getApplicationRoleConnection.js`),
 },
 updateApplicationRoleConnection: {
  reload: async () => {
   self.updateApplicationRoleConnection.file = await import(
    `../../../../requestHandler/users/updateApplicationRoleConnection.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/users/updateApplicationRoleConnection.js`),
 },
};

export default self;
