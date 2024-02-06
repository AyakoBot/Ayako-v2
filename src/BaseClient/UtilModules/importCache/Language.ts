const self = {
 languages: {
  enJSON: {
   reload: async () => {
    self.languages.enJSON.file = await import(
     `../../../../languages/en-GB.json?version=${Date.now()}`,
     { assert: { type: 'json' } }
    );
   },
   file: await import(`../../../Languages/en-GB.json`, { assert: { type: 'json' } }),
  },
  deJSON: {
   reload: async () => {
    self.languages.deJSON.file = await import(
     `../../../../languages/de-DE.json?version=${Date.now()}`,
     { assert: { type: 'json' } }
    );
   },
   file: await import(`../../../Languages/de-DE.json`, { assert: { type: 'json' } }),
  },
 },

 t: {
  leveling: {
   reload: async () => {
    self.t.leveling.file = await import(`../../Other/language/leveling.js?version=${Date.now()}`);
   },
   file: await import(`../../Other/language/leveling.js`),
  },
  time: {
   reload: async () => {
    self.t.time.file = await import(`../../Other/language/time.js?version=${Date.now()}`);
   },
   file: await import(`../../Other/language/time.js`),
  },
  languageFunction: {
   reload: async () => {
    self.t.languageFunction.file = await import(
     `../../Other/language/languageFunction.js?version=${Date.now()}`
    );
   },
   file: await import(`../../Other/language/languageFunction.js`),
  },
  events: {
   reload: async () => {
    self.t.events.file = await import(
     `../../Other/language/events/events.js?version=${Date.now()}`
    );
   },
   file: await import(`../../Other/language/events/events.js`),
  },
  channelTypes: {
   reload: async () => {
    self.t.channelTypes.file = await import(
     `../../Other/language/channelTypes.js?version=${Date.now()}`
    );
   },
   file: await import(`../../Other/language/channelTypes.js`),
  },
  verification: {
   reload: async () => {
    self.t.verification.file = await import(
     `../../Other/language/verification.js?version=${Date.now()}`
    );
   },
   file: await import(`../../Other/language/verification.js`),
  },
  expire: {
   reload: async () => {
    self.t.expire.file = await import(`../../Other/language/expire.js?version=${Date.now()}`);
   },
   file: await import(`../../Other/language/expire.js`),
  },
  slashCommands: {
   reload: async () => {
    self.t.slashCommands.file = await import(
     `../../Other/language/slashCommands.js?version=${Date.now()}`
    );
   },
   file: await import(`../../Other/language/slashCommands.js`),
  },
  nitro: {
   reload: async () => {
    self.t.nitro.file = await import(`../../Other/language/nitro.js?version=${Date.now()}`);
   },
   file: await import(`../../Other/language/nitro.js`),
  },
  mod: {
   reload: async () => {
    self.t.mod.file = await import(`../../Other/language/mod.js?version=${Date.now()}`);
   },
   file: await import(`../../Other/language/mod.js`),
  },
  censor: {
   reload: async () => {
    self.t.censor.file = await import(`../../Other/language/censor.js?version=${Date.now()}`);
   },
   file: await import(`../../Other/language/censor.js`),
  },
  antivirus: {
   reload: async () => {
    self.t.antivirus.file = await import(`../../Other/language/antivirus.js?version=${Date.now()}`);
   },
   file: await import(`../../Other/language/antivirus.js`),
  },
  autotypes: {
   reload: async () => {
    self.t.autotypes.file = await import(`../../Other/language/autotypes.js?version=${Date.now()}`);
   },
   file: await import(`../../Other/language/autotypes.js`),
  },
  channelRules: {
   reload: async () => {
    self.t.channelRules.file = await import(
     `../../Other/language/channelRules.js?version=${Date.now()}`
    );
   },
   file: await import(`../../Other/language/channelRules.js`),
  },
  defaultAutoArchiveDuration: {
   reload: async () => {
    self.t.defaultAutoArchiveDuration.file = await import(
     `../../Other/language/defaultAutoArchiveDuration.js?version=${Date.now()}`
    );
   },
   file: await import(`../../Other/language/defaultAutoArchiveDuration.js`),
  },
  defaultForumLayout: {
   reload: async () => {
    self.t.defaultForumLayout.file = await import(
     `../../Other/language/defaultForumLayout.js?version=${Date.now()}`
    );
   },
   file: await import(`../../Other/language/defaultForumLayout.js`),
  },
  defaultSortOrder: {
   reload: async () => {
    self.t.defaultSortOrder.file = await import(
     `../../Other/language/defaultSortOrder.js?version=${Date.now()}`
    );
   },
   file: await import(`../../Other/language/defaultSortOrder.js`),
  },
  auditLogAction: {
   reload: async () => {
    self.t.auditLogAction.file = await import(
     `../../Other/language/auditLogAction.js?version=${Date.now()}`
    );
   },
   file: await import(`../../Other/language/auditLogAction.js`),
  },
 },
};

export default self;
