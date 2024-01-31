const self = {
 'embed-builder': {
  send: {
   reload: async () => {
    self['embed-builder'].send.file = await import(
     `../../../../../Commands/SelectCommands/ChannelSelect/embed-builder/send.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SelectCommands/ChannelSelect/embed-builder/send.js`),
  },
 },
 info: {
  perms: {
   reload: async () => {
    self.info.perms.file = await import(
     `../../../../../Commands/SelectCommands/ChannelSelect/info/perms.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SelectCommands/ChannelSelect/info/perms.js`),
  },
 },
 settings: {
  channel: {
   reload: async () => {
    self.settings.channel.file = await import(
     `../../../../../Commands/SelectCommands/ChannelSelect/settings/channel.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SelectCommands/ChannelSelect/settings/channel.js`),
  },
  channels: {
   reload: async () => {
    self.settings.channels.file = await import(
     `../../../../../Commands/SelectCommands/ChannelSelect/settings/channels.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/SelectCommands/ChannelSelect/settings/channels.js`),
  },
 },
};

export default self;
