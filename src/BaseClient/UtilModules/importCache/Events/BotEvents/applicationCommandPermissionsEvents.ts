const self = {
 applicationCommandPermissionsUpdate: {
  reload: async () => {
   self.applicationCommandPermissionsUpdate.file = await import(
    `../../../../../Events/BotEvents/applicationCommandPermissionsEvents/applicationCommandPermissionsUpdate.js?version=${Date.now()}`
   );
  },
  file: await import(
   `../../../../../Events/BotEvents/applicationCommandPermissionsEvents/applicationCommandPermissionsUpdate.js`
  ),
 },
 cache: {
  reload: async () => {
   self.cache.file = await import(
    `../../../../../Events/BotEvents/applicationCommandPermissionsEvents/cache.js?version=${Date.now()}`
   );
  },
  file: await import(
   `../../../../../Events/BotEvents/applicationCommandPermissionsEvents/cache.js`
  ),
 },
 log: {
  reload: async () => {
   self.log.file = await import(
    `../../../../../Events/BotEvents/applicationCommandPermissionsEvents/log.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Events/BotEvents/applicationCommandPermissionsEvents/log.js`),
 },
};

export default self;
