const self = {
 voiceStateCreates: {
  log: {
   reload: async () => {
    self.voiceStateCreates.log.file = await import(
     `../../../../../Events/BotEvents/voiceStateEvents/voiceStateCreates/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/voiceStateEvents/voiceStateCreates/log.js`),
  },
  voiceHub: {
   reload: async () => {
    self.voiceStateCreates.voiceHub.file = await import(
     `../../../../../Events/BotEvents/voiceStateEvents/voiceStateCreates/voiceHub.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/voiceStateEvents/voiceStateCreates/voiceHub.js`
   ),
  },
  voiceStateCreates: {
   reload: async () => {
    self.voiceStateCreates.voiceStateCreates.file = await import(
     `../../../../../Events/BotEvents/voiceStateEvents/voiceStateCreates/voiceStateCreates.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/voiceStateEvents/voiceStateCreates/voiceStateCreates.js`
   ),
  },
 },
 voiceStateDeletes: {
  log: {
   reload: async () => {
    self.voiceStateDeletes.log.file = await import(
     `../../../../../Events/BotEvents/voiceStateEvents/voiceStateDeletes/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/voiceStateEvents/voiceStateDeletes/log.js`),
  },
  voiceHub: {
   reload: async () => {
    self.voiceStateDeletes.voiceHub.file = await import(
     `../../../../../Events/BotEvents/voiceStateEvents/voiceStateDeletes/voiceHub.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/voiceStateEvents/voiceStateDeletes/voiceHub.js`
   ),
  },
  voiceStateDeletes: {
   reload: async () => {
    self.voiceStateDeletes.voiceStateDeletes.file = await import(
     `../../../../../Events/BotEvents/voiceStateEvents/voiceStateDeletes/voiceStateDeletes.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/voiceStateEvents/voiceStateDeletes/voiceStateDeletes.js`
   ),
  },
 },
 voiceStateUpdates: {
  log: {
   reload: async () => {
    self.voiceStateUpdates.log.file = await import(
     `../../../../../Events/BotEvents/voiceStateEvents/voiceStateUpdates/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/voiceStateEvents/voiceStateUpdates/log.js`),
  },
  voiceStateUpdates: {
   reload: async () => {
    self.voiceStateUpdates.voiceStateUpdates.file = await import(
     `../../../../../Events/BotEvents/voiceStateEvents/voiceStateUpdates/voiceStateUpdates.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/voiceStateEvents/voiceStateUpdates/voiceStateUpdates.js`
   ),
  },
 },
 voiceStateUpdate: {
  reload: async () => {
   self.voiceStateUpdate.file = await import(
    `../../../../../Events/BotEvents/voiceStateEvents/voiceStateUpdate.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Events/BotEvents/voiceStateEvents/voiceStateUpdate.js`),
 },
};

export default self;
