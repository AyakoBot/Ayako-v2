const self = {
 auditLogs: {
  reload: async () => {
   self.auditLogs.file = await import(
    `../../../../cache/discord/auditLogs.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../cache/discord/auditLogs.js`),
 },
 commandPermissions: {
  reload: async () => {
   self.commandPermissions.file = await import(
    `../../../../cache/discord/commandPermissions.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../cache/discord/commandPermissions.js`),
 },
 commands: {
  reload: async () => {
   self.commands.file = await import(`../../../../cache/discord/commands.js?version=${Date.now()}`);
  },
  file: await import(`../../../../cache/discord/commands.js`),
 },
 integrations: {
  reload: async () => {
   self.integrations.file = await import(
    `../../../../cache/discord/integrations.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../cache/discord/integrations.js`),
 },
 inviteGuilds: {
  reload: async () => {
   self.inviteGuilds.file = await import(
    `../../../../cache/discord/inviteGuilds.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../cache/discord/inviteGuilds.js`),
 },
 invites: {
  reload: async () => {
   self.file = await import(`../../../../cache/discord/invites.js?version=${Date.now()}`);
  },
  file: await import(`../../../../cache/discord/invites.js`),
 },
 onboarding: {
  reload: async () => {
   self.onboarding.file = await import(
    `../../../../cache/discord/onboarding.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../cache/discord/onboarding.js`),
 },
 pins: {
  reload: async () => {
   self.pins.file = await import(`../../../../cache/discord/pins.js?version=${Date.now()}`);
  },
  file: await import(`../../../../cache/discord/pins.js`),
 },
 scheduledEventUsers: {
  reload: async () => {
   self.scheduledEventUsers.file = await import(
    `../../../../cache/discord/scheduledEventUsers.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../cache/discord/scheduledEventUsers.js`),
 },
 webhooks: {
  reload: async () => {
   self.webhooks.file = await import(`../../../../cache/discord/webhooks.js?version=${Date.now()}`);
  },
  file: await import(`../../../../cache/discord/webhooks.js`),
 },
 welcomeScreens: {
  reload: async () => {
   self.welcomeScreens.file = await import(
    `../../../../cache/discord/welcomeScreens.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../cache/discord/welcomeScreens.js`),
 },
};

export default self;
