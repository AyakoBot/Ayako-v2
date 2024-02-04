const self = {
 messageCreate: {
  afk: {
   reload: async () => {
    self.messageCreate.afk.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageCreate/afk.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/messageEvents/messageCreate/afk.js`),
  },
  antispam: {
   reload: async () => {
    self.messageCreate.antispam.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageCreate/antispam.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/messageEvents/messageCreate/antispam.js`),
  },
  antivirus: {
   reload: async () => {
    self.messageCreate.antivirus.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageCreate/antivirus.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/messageEvents/messageCreate/antivirus.js`),
  },
  ashes: {
   reload: async () => {
    self.messageCreate.ashes.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageCreate/ashes.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/messageEvents/messageCreate/ashes.js`),
  },
  commandHandler: {
   reload: async () => {
    self.messageCreate.commandHandler.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageCreate/commandHandler.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/messageEvents/messageCreate/commandHandler.js`
   ),
  },
  disboard: {
   reload: async () => {
    self.messageCreate.disboard.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageCreate/disboard.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/messageEvents/messageCreate/disboard.js`),
  },
  dmLog: {
   reload: async () => {
    self.messageCreate.dmLog.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageCreate/dmLog.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/messageEvents/messageCreate/dmLog.js`),
  },
  eval: {
   reload: async () => {
    self.messageCreate.eval.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageCreate/eval.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/messageEvents/messageCreate/eval.js`),
  },
  execute: {
   reload: async () => {
    self.messageCreate.execute.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageCreate/execute.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/messageEvents/messageCreate/execute.js`),
  },
  invites: {
   reload: async () => {
    self.messageCreate.invites.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageCreate/invites.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/messageEvents/messageCreate/invites.js`),
  },
  levelling: {
   reload: async () => {
    self.messageCreate.levelling.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageCreate/levelling.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/messageEvents/messageCreate/levelling.js`),
  },
  messageCreate: {
   reload: async () => {
    self.messageCreate.messageCreate.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageCreate/messageCreate.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/messageEvents/messageCreate/messageCreate.js`
   ),
  },
  newlines: {
   reload: async () => {
    self.messageCreate.newlines.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageCreate/newlines.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/messageEvents/messageCreate/newlines.js`),
  },
  other: {
   reload: async () => {
    self.messageCreate.other.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageCreate/other.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/messageEvents/messageCreate/other.js`),
  },
  revengePing: {
   reload: async () => {
    self.messageCreate.revengePing.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageCreate/revengePing.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/messageEvents/messageCreate/revengePing.js`),
  },
  stickyMessage: {
   reload: async () => {
    self.messageCreate.stickyMessage.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageCreate/stickyMessage.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/messageEvents/messageCreate/stickyMessage.js`
   ),
  },
  tta: {
   reload: async () => {
    self.messageCreate.tta.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageCreate/tta.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/messageEvents/messageCreate/tta.js`),
  },
 },
 messageDelete: {
  cache: {
   reload: async () => {
    self.messageDelete.cache.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageDelete/cache.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/messageEvents/messageDelete/cache.js`),
  },
  log: {
   reload: async () => {
    self.messageDelete.log.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageDelete/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/messageEvents/messageDelete/log.js`),
  },
  messageDelete: {
   reload: async () => {
    self.messageDelete.messageDelete.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageDelete/messageDelete.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/messageEvents/messageDelete/messageDelete.js`
   ),
  },
 },
 messageDeleteBulk: {
  log: {
   reload: async () => {
    self.messageDeleteBulk.log.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageDeleteBulk/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/messageEvents/messageDeleteBulk/log.js`),
  },
  messageDeleteBulk: {
   reload: async () => {
    self.messageDeleteBulk.messageDeleteBulk.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageDeleteBulk/messageDeleteBulk.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/messageEvents/messageDeleteBulk/messageDeleteBulk.js`
   ),
  },
 },
 messageReactionAdd: {
  log: {
   reload: async () => {
    self.messageReactionAdd.log.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageReactionAdd/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/messageEvents/messageReactionAdd/log.js`),
  },
  messageReactionAdd: {
   reload: async () => {
    self.messageReactionAdd.messageReactionAdd.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageReactionAdd/messageReactionAdd.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/messageEvents/messageReactionAdd/messageReactionAdd.js`
   ),
  },
  reactionRoles: {
   reload: async () => {
    self.messageReactionAdd.reactionRoles.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageReactionAdd/reactionRoles.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/messageEvents/messageReactionAdd/reactionRoles.js`
   ),
  },
 },
 messageReactionRemove: {
  log: {
   reload: async () => {
    self.messageReactionRemove.log.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageReactionRemove/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/messageEvents/messageReactionRemove/log.js`),
  },
  messageReactionRemove: {
   reload: async () => {
    self.messageReactionRemove.messageReactionRemove.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageReactionRemove/messageReactionRemove.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/messageEvents/messageReactionRemove/messageReactionRemove.js`
   ),
  },
  reactionRoles: {
   reload: async () => {
    self.messageReactionRemove.reactionRoles.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageReactionRemove/reactionRoles.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/messageEvents/messageReactionRemove/reactionRoles.js`
   ),
  },
 },
 messageReactionRemoveAll: {
  log: {
   reload: async () => {
    self.messageReactionRemoveAll.log.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageReactionRemoveAll/log.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/messageEvents/messageReactionRemoveAll/log.js`
   ),
  },
  messageReactionRemoveAll: {
   reload: async () => {
    self.messageReactionRemoveAll.messageReactionRemoveAll.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageReactionRemoveAll/messageReactionRemoveAll.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/messageEvents/messageReactionRemoveAll/messageReactionRemoveAll.js`
   ),
  },
 },
 messageReactionRemoveEmoji: {
  log: {
   reload: async () => {
    self.messageReactionRemoveEmoji.log.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageReactionRemoveEmoji/log.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/messageEvents/messageReactionRemoveEmoji/log.js`
   ),
  },
  messageReactionRemoveEmoji: {
   reload: async () => {
    self.messageReactionRemoveEmoji.messageReactionRemoveEmoji.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageReactionRemoveEmoji/messageReactionRemoveEmoji.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/messageEvents/messageReactionRemoveEmoji/messageReactionRemoveEmoji.js`
   ),
  },
 },
 messageUpdate: {
  log: {
   reload: async () => {
    self.messageUpdate.log.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageUpdate/log.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Events/BotEvents/messageEvents/messageUpdate/log.js`),
  },
  messageUpdate: {
   reload: async () => {
    self.messageUpdate.messageUpdate.file = await import(
     `../../../../../Events/BotEvents/messageEvents/messageUpdate/messageUpdate.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/messageEvents/messageUpdate/messageUpdate.js`
   ),
  },
 },
};

export default self;
