const self = {
 pardon: {
  after: {
   reload: async () => {
    self.pardon.after.file = await import(
     `../../../../../Commands/SlashCommands/mod/pardon/after.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/mod/pardon/after.js`),
  },
  'all-by': {
   reload: async () => {
    self.pardon['all-by'].file = await import(
     `../../../../../Commands/SlashCommands/mod/pardon/all-by.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/mod/pardon/all-by.js`),
  },
  'all-on': {
   reload: async () => {
    self.pardon['all-on'].file = await import(
     `../../../../../Commands/SlashCommands/mod/pardon/all-on.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/mod/pardon/all-on.js`),
  },
  before: {
   reload: async () => {
    self.pardon.before.file = await import(
     `../../../../../Commands/SlashCommands/mod/pardon/before.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/mod/pardon/before.js`),
  },
  between: {
   reload: async () => {
    self.pardon.between.file = await import(
     `../../../../../Commands/SlashCommands/mod/pardon/between.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/mod/pardon/between.js`),
  },
  by: {
   reload: async () => {
    self.pardon.by.file = await import(
     `../../../../../Commands/SlashCommands/mod/pardon/by.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/mod/pardon/by.js`),
  },
  one: {
   reload: async () => {
    self.pardon.one.file = await import(
     `../../../../../Commands/SlashCommands/mod/pardon/one.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SlashCommands/mod/pardon/one.js`),
  },
 },
 ban: {
  reload: async () => {
   self.ban.file = await import(
    `../../../../../Commands/SlashCommands/mod/ban.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/mod/ban.js`),
 },
 'channel-ban': {
  reload: async () => {
   self['channel-ban'].file = await import(
    `../../../../../Commands/SlashCommands/mod/channel-ban.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/mod/channel-ban.js`),
 },
 'channel-unban': {
  reload: async () => {
   self['channel-unban'].file = await import(
    `../../../../../Commands/SlashCommands/mod/channel-unban.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/mod/channel-unban.js`),
 },
 check: {
  reload: async () => {
   self.check.file = await import(
    `../../../../../Commands/SlashCommands/mod/check.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/mod/check.js`),
 },
 edit: {
  reload: async () => {
   self.edit.file = await import(
    `../../../../../Commands/SlashCommands/mod/edit.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/mod/edit.js`),
 },
 kick: {
  reload: async () => {
   self.kick.file = await import(
    `../../../../../Commands/SlashCommands/mod/kick.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/mod/kick.js`),
 },
 permissions: {
  reload: async () => {
   self.permissions.file = await import(
    `../../../../../Commands/SlashCommands/mod/permissions.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/mod/permissions.js`),
 },
 slowmode: {
  reload: async () => {
   self.slowmode.file = await import(
    `../../../../../Commands/SlashCommands/mod/slowmode.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/mod/slowmode.js`),
 },
 'soft-ban': {
  reload: async () => {
   self['soft-ban'].file = await import(
    `../../../../../Commands/SlashCommands/mod/soft-ban.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/mod/soft-ban.js`),
 },
 'soft-warn': {
  reload: async () => {
   self['soft-warn'].file = await import(
    `../../../../../Commands/SlashCommands/mod/soft-warn.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/mod/soft-warn.js`),
 },
 strike: {
  reload: async () => {
   self.strike.file = await import(
    `../../../../../Commands/SlashCommands/mod/strike.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/mod/strike.js`),
 },
 'temp-ban': {
  reload: async () => {
   self['temp-ban'].file = await import(
    `../../../../../Commands/SlashCommands/mod/temp-ban.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/mod/temp-ban.js`),
 },
 'temp-channel-ban': {
  reload: async () => {
   self['temp-channel-ban'].file = await import(
    `../../../../../Commands/SlashCommands/mod/temp-channel-ban.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/mod/temp-channel-ban.js`),
 },
 tempmute: {
  reload: async () => {
   self.tempmute.file = await import(
    `../../../../../Commands/SlashCommands/mod/tempmute.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/mod/tempmute.js`),
 },
 unafk: {
  reload: async () => {
   self.unafk.file = await import(
    `../../../../../Commands/SlashCommands/mod/unafk.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/mod/unafk.js`),
 },
 unban: {
  reload: async () => {
   self.unban.file = await import(
    `../../../../../Commands/SlashCommands/mod/unban.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/mod/unban.js`),
 },
 unmute: {
  reload: async () => {
   self.unmute.file = await import(
    `../../../../../Commands/SlashCommands/mod/unmute.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/mod/unmute.js`),
 },
 warn: {
  reload: async () => {
   self.warn.file = await import(
    `../../../../../Commands/SlashCommands/mod/warn.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/mod/warn.js`),
 },
};

export default self;
