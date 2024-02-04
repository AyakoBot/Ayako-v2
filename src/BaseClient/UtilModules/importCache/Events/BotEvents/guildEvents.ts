const self = {
 guildAuditLogEntryEvents: {
  cache: {
   reload: async () => {
    self.guildAuditLogEntryEvents.cache.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildAuditLogEntryEvents/cache.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/guildEvents/guildAuditLogEntryEvents/cache.js`
   ),
  },
  guildAuditLogEntryCreate: {
   reload: async () => {
    self.guildAuditLogEntryEvents.guildAuditLogEntryCreate.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildAuditLogEntryEvents/guildAuditLogEntryCreate.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/guildEvents/guildAuditLogEntryEvents/guildAuditLogEntryCreate.js`
   ),
  },
 },
 guildBanAdd: {
  guildBanAdd: {
   reload: async () => {
    self.guildBanAdd.guildBanAdd.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildBanAdd/guildBanAdd.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildBanAdd/guildBanAdd.js`),
  },
  log: {
   reload: async () => {
    self.guildBanAdd.log.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildBanAdd/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildBanAdd/log.js`),
  },
 },
 guildBanRemove: {
  cache: {
   reload: async () => {
    self.guildBanRemove.cache.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildBanRemove/cache.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildBanRemove/cache.js`),
  },
  guildBanRemove: {
   reload: async () => {
    self.guildBanRemove.guildBanRemove.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildBanRemove/guildBanRemove.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/guildEvents/guildBanRemove/guildBanRemove.js`
   ),
  },
  log: {
   reload: async () => {
    self.guildBanRemove.log.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildBanRemove/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildBanRemove/log.js`),
  },
 },
 guildCreate: {
  cache: {
   reload: async () => {
    self.guildCreate.cache.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildCreate/cache.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildCreate/cache.js`),
  },
  guildCreate: {
   reload: async () => {
    self.guildCreate.guildCreate.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildCreate/guildCreate.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildCreate/guildCreate.js`),
  },
  log: {
   reload: async () => {
    self.guildCreate.log.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildCreate/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildCreate/log.js`),
  },
 },
 guildDelete: {
  cache: {
   reload: async () => {
    self.guildDelete.cache.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildDelete/cache.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildDelete/cache.js`),
  },
  guildDelete: {
   reload: async () => {
    self.guildDelete.guildDelete.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildDelete/guildDelete.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildDelete/guildDelete.js`),
  },
  log: {
   reload: async () => {
    self.guildDelete.log.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildDelete/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildDelete/log.js`),
  },
 },
 guildIntegrationsUpdate: {
  guildIntegrationsCreates: {
   guildIntegrationsCreates: {
    reload: async () => {
     self.guildIntegrationsUpdate.guildIntegrationsCreates.guildIntegrationsCreates.file =
      await import(
       `../../../../../Events/BotEvents/guildEvents/guildIntegrationsUpdate/guildIntegrationsCreates/guildIntegrationsCreates.js?version=${Date.now()}`
      );
    },
    file: await import(
     `../../../../../Events/BotEvents/guildEvents/guildIntegrationsUpdate/guildIntegrationsCreates/guildIntegrationsCreates.js`
    ),
   },
   log: {
    reload: async () => {
     self.guildIntegrationsUpdate.guildIntegrationsCreates.log.file = await import(
      `../../../../../Events/BotEvents/guildEvents/guildIntegrationsUpdate/guildIntegrationsCreates/log.js?version=${Date.now()}`
     );
    },
    file: await import(
     `../../../../../Events/BotEvents/guildEvents/guildIntegrationsUpdate/guildIntegrationsCreates/log.js`
    ),
   },
  },
  guildIntegrationsDeletes: {
   guildIntegrationsDeletes: {
    reload: async () => {
     self.guildIntegrationsUpdate.guildIntegrationsDeletes.guildIntegrationsDeletes.file =
      await import(
       `../../../../../Events/BotEvents/guildEvents/guildIntegrationsUpdate/guildIntegrationsDeletes/guildIntegrationsDeletes.js?version=${Date.now()}`
      );
    },
    file: await import(
     `../../../../../Events/BotEvents/guildEvents/guildIntegrationsUpdate/guildIntegrationsDeletes/guildIntegrationsDeletes.js`
    ),
   },
   log: {
    reload: async () => {
     self.guildIntegrationsUpdate.guildIntegrationsDeletes.log.file = await import(
      `../../../../../Events/BotEvents/guildEvents/guildIntegrationsUpdate/guildIntegrationsDeletes/log.js?version=${Date.now()}`
     );
    },
    file: await import(
     `../../../../../Events/BotEvents/guildEvents/guildIntegrationsUpdate/guildIntegrationsDeletes/log.js`
    ),
   },
  },
  guildIntegrationsUpdates: {
   guildIntegrationsUpdates: {
    reload: async () => {
     self.guildIntegrationsUpdate.guildIntegrationsUpdates.guildIntegrationsUpdates.file =
      await import(
       `../../../../../Events/BotEvents/guildEvents/guildIntegrationsUpdate/guildIntegrationsUpdates/guildIntegrationsUpdates.js?version=${Date.now()}`
      );
    },
    file: await import(
     `../../../../../Events/BotEvents/guildEvents/guildIntegrationsUpdate/guildIntegrationsUpdates/guildIntegrationsUpdates.js`
    ),
   },
   log: {
    reload: async () => {
     self.guildIntegrationsUpdate.guildIntegrationsUpdates.log.file = await import(
      `../../../../../Events/BotEvents/guildEvents/guildIntegrationsUpdate/guildIntegrationsUpdates/log.js?version=${Date.now()}`
     );
    },
    file: await import(
     `../../../../../Events/BotEvents/guildEvents/guildIntegrationsUpdate/guildIntegrationsUpdates/log.js`
    ),
   },
  },
  guildIntegrationsUpdate: {
   reload: async () => {
    self.guildIntegrationsUpdate.guildIntegrationsUpdate.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildIntegrationsUpdate/guildIntegrationsUpdate.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/guildEvents/guildIntegrationsUpdate/guildIntegrationsUpdate.js`
   ),
  },
 },
 guildMemberAdd: {
  affiliates: {
   reload: async () => {
    self.guildMemberAdd.affiliates.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildMemberAdd/affiliates.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildMemberAdd/affiliates.js`),
  },
  antiraid: {
   reload: async () => {
    self.guildMemberAdd.antiraid.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildMemberAdd/antiraid.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildMemberAdd/antiraid.js`),
  },
  autoroles: {
   reload: async () => {
    self.guildMemberAdd.autoroles.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildMemberAdd/autoroles.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildMemberAdd/autoroles.js`),
  },
  checkMuted: {
   reload: async () => {
    self.guildMemberAdd.checkMuted.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildMemberAdd/checkMuted.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildMemberAdd/checkMuted.js`),
  },
  guildMemberAdd: {
   reload: async () => {
    self.guildMemberAdd.guildMemberAdd.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildMemberAdd/guildMemberAdd.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/guildEvents/guildMemberAdd/guildMemberAdd.js`
   ),
  },
  log: {
   reload: async () => {
    self.guildMemberAdd.log.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildMemberAdd/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildMemberAdd/log.js`),
  },
  nitro: {
   reload: async () => {
    self.guildMemberAdd.nitro.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildMemberAdd/nitro.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildMemberAdd/nitro.js`),
  },
  ptReminder: {
   reload: async () => {
    self.guildMemberAdd.ptReminder.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildMemberAdd/ptReminder.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildMemberAdd/ptReminder.js`),
  },
  stickyPerms: {
   reload: async () => {
    self.guildMemberAdd.stickyPerms.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildMemberAdd/stickyPerms.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildMemberAdd/stickyPerms.js`),
  },
  stickyRoles: {
   reload: async () => {
    self.guildMemberAdd.stickyRoles.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildMemberAdd/stickyRoles.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildMemberAdd/stickyRoles.js`),
  },
  verification: {
   reload: async () => {
    self.guildMemberAdd.verification.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildMemberAdd/verification.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildMemberAdd/verification.js`),
  },
  welcome: {
   reload: async () => {
    self.guildMemberAdd.welcome.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildMemberAdd/welcome.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildMemberAdd/welcome.js`),
  },
 },
 guildMemberPrune: {
  guildMemberPrune: {
   reload: async () => {
    self.guildMemberPrune.guildMemberPrune.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildMemberPrune/guildMemberPrune.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/guildEvents/guildMemberPrune/guildMemberPrune.js`
   ),
  },
  log: {
   reload: async () => {
    self.guildMemberPrune.log.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildMemberPrune/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildMemberPrune/log.js`),
  },
 },
 guildMemberRemove: {
  customRole: {
   reload: async () => {
    self.guildMemberRemove.customRole.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildMemberRemove/customRole.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/guildEvents/guildMemberRemove/customRole.js`
   ),
  },
  guildMemberRemove: {
   reload: async () => {
    self.guildMemberRemove.guildMemberRemove.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildMemberRemove/guildMemberRemove.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/guildEvents/guildMemberRemove/guildMemberRemove.js`
   ),
  },
  log: {
   reload: async () => {
    self.guildMemberRemove.log.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildMemberRemove/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildMemberRemove/log.js`),
  },
  nitro: {
   reload: async () => {
    self.guildMemberRemove.nitro.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildMemberRemove/nitro.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildMemberRemove/nitro.js`),
  },
  stickyRoles: {
   reload: async () => {
    self.guildMemberRemove.stickyRoles.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildMemberRemove/stickyRoles.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/guildEvents/guildMemberRemove/stickyRoles.js`
   ),
  },
 },
 guildMemberUpdate: {
  boost: {
   reload: async () => {
    self.guildMemberUpdate.boost.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildMemberUpdate/boost.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildMemberUpdate/boost.js`),
  },
  cache: {
   reload: async () => {
    self.guildMemberUpdate.cache.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildMemberUpdate/cache.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildMemberUpdate/cache.js`),
  },
  guildMemberUpdate: {
   reload: async () => {
    self.guildMemberUpdate.guildMemberUpdate.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildMemberUpdate/guildMemberUpdate.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/guildEvents/guildMemberUpdate/guildMemberUpdate.js`
   ),
  },
  log: {
   reload: async () => {
    self.guildMemberUpdate.log.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildMemberUpdate/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildMemberUpdate/log.js`),
  },
  nitro: {
   reload: async () => {
    self.guildMemberUpdate.nitro.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildMemberUpdate/nitro.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildMemberUpdate/nitro.js`),
  },
  rewards: {
   reload: async () => {
    self.guildMemberUpdate.rewards.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildMemberUpdate/rewards.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildMemberUpdate/rewards.js`),
  },
  separator: {
   reload: async () => {
    self.guildMemberUpdate.separator.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildMemberUpdate/separator.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildMemberUpdate/separator.js`),
  },
 },
 guildScheduledEventEvents: {
  guildScheduledEventCreate: {
   guildScheduledEventCreate: {
    reload: async () => {
     self.guildScheduledEventEvents.guildScheduledEventCreate.guildScheduledEventCreate.file =
      await import(
       `../../../../../Events/BotEvents/guildEvents/guildScheduledEventEvents/guildScheduledEventCreate/guildScheduledEventCreate.js?version=${Date.now()}`
      );
    },
    file: await import(
     `../../../../../Events/BotEvents/guildEvents/guildScheduledEventEvents/guildScheduledEventCreate/guildScheduledEventCreate.js`
    ),
   },
   log: {
    reload: async () => {
     self.guildScheduledEventEvents.guildScheduledEventCreate.log.file = await import(
      `../../../../../Events/BotEvents/guildEvents/guildScheduledEventEvents/guildScheduledEventCreate/log.js?version=${Date.now()}`
     );
    },
    file: await import(
     `../../../../../Events/BotEvents/guildEvents/guildScheduledEventEvents/guildScheduledEventCreate/log.js`
    ),
   },
  },
  guildScheduledEventDelete: {
   guildScheduledEventDelete: {
    reload: async () => {
     self.guildScheduledEventEvents.guildScheduledEventDelete.guildScheduledEventDelete.file =
      await import(
       `../../../../../Events/BotEvents/guildEvents/guildScheduledEventEvents/guildScheduledEventDelete/guildScheduledEventDelete.js?version=${Date.now()}`
      );
    },
    file: await import(
     `../../../../../Events/BotEvents/guildEvents/guildScheduledEventEvents/guildScheduledEventDelete/guildScheduledEventDelete.js`
    ),
   },
   log: {
    reload: async () => {
     self.guildScheduledEventEvents.guildScheduledEventDelete.log.file = await import(
      `../../../../../Events/BotEvents/guildEvents/guildScheduledEventEvents/guildScheduledEventDelete/log.js?version=${Date.now()}`
     );
    },
    file: await import(
     `../../../../../Events/BotEvents/guildEvents/guildScheduledEventEvents/guildScheduledEventDelete/log.js`
    ),
   },
  },
  guildScheduledEventUpdate: {
   guildScheduledEventUpdate: {
    reload: async () => {
     self.guildScheduledEventEvents.guildScheduledEventUpdate.guildScheduledEventUpdate.file =
      await import(
       `../../../../../Events/BotEvents/guildEvents/guildScheduledEventEvents/guildScheduledEventUpdate/guildScheduledEventUpdate.js?version=${Date.now()}`
      );
    },
    file: await import(
     `../../../../../Events/BotEvents/guildEvents/guildScheduledEventEvents/guildScheduledEventUpdate/guildScheduledEventUpdate.js`
    ),
   },
   log: {
    reload: async () => {
     self.guildScheduledEventEvents.guildScheduledEventUpdate.log.file = await import(
      `../../../../../Events/BotEvents/guildEvents/guildScheduledEventEvents/guildScheduledEventUpdate/log.js?version=${Date.now()}`
     );
    },
    file: await import(
     `../../../../../Events/BotEvents/guildEvents/guildScheduledEventEvents/guildScheduledEventUpdate/log.js`
    ),
   },
  },
  guildScheduledEventUserAdd: {
   guildScheduledEventUserAdd: {
    reload: async () => {
     self.guildScheduledEventEvents.guildScheduledEventUserAdd.guildScheduledEventUserAdd.file =
      await import(
       `../../../../../Events/BotEvents/guildEvents/guildScheduledEventEvents/guildScheduledEventUserAdd/guildScheduledEventUserAdd.js?version=${Date.now()}`
      );
    },
    file: await import(
     `../../../../../Events/BotEvents/guildEvents/guildScheduledEventEvents/guildScheduledEventUserAdd/guildScheduledEventUserAdd.js`
    ),
   },
   log: {
    reload: async () => {
     self.guildScheduledEventEvents.guildScheduledEventUserAdd.log.file = await import(
      `../../../../../Events/BotEvents/guildEvents/guildScheduledEventEvents/guildScheduledEventUserAdd/log.js?version=${Date.now()}`
     );
    },
    file: await import(
     `../../../../../Events/BotEvents/guildEvents/guildScheduledEventEvents/guildScheduledEventUserAdd/log.js`
    ),
   },
  },
  guildScheduledEventUserRemove: {
   guildScheduledEventUserRemove: {
    reload: async () => {
     // eslint-disable-next-line max-len
     self.guildScheduledEventEvents.guildScheduledEventUserRemove.guildScheduledEventUserRemove.file =
      await import(
       `../../../../../Events/BotEvents/guildEvents/guildScheduledEventEvents/guildScheduledEventUserRemove/guildScheduledEventUserRemove.js?version=${Date.now()}`
      );
    },
    file: await import(
     `../../../../../Events/BotEvents/guildEvents/guildScheduledEventEvents/guildScheduledEventUserRemove/guildScheduledEventUserRemove.js`
    ),
   },
   log: {
    reload: async () => {
     self.guildScheduledEventEvents.guildScheduledEventUserRemove.log.file = await import(
      `../../../../../Events/BotEvents/guildEvents/guildScheduledEventEvents/guildScheduledEventUserRemove/log.js?version=${Date.now()}`
     );
    },
    file: await import(
     `../../../../../Events/BotEvents/guildEvents/guildScheduledEventEvents/guildScheduledEventUserRemove/log.js`
    ),
   },
  },
 },
 guildUpdate: {
  guildUpdate: {
   reload: async () => {
    self.guildUpdate.guildUpdate.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildUpdate/guildUpdate.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildUpdate/guildUpdate.js`),
  },
  log: {
   reload: async () => {
    self.guildUpdate.log.file = await import(
     `../../../../../Events/BotEvents/guildEvents/guildUpdate/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/guildEvents/guildUpdate/log.js`),
  },
 },
};

export default self;
