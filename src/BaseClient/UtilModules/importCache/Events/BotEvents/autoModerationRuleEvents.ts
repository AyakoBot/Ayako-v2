const self = {
 autoModerationRuleCreate: {
  autoModerationRuleCreate: {
   reload: async () => {
    self.autoModerationRuleCreate.autoModerationRuleCreate.file = await import(
     `../../../../../Events/BotEvents/autoModerationRuleEvents/autoModerationRuleCreate.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/autoModerationRuleEvents/autoModerationRuleCreate/autoModerationRuleCreate.js`
   ),
  },
  log: {
   reload: async () => {
    self.autoModerationRuleCreate.log.file = await import(
     `../../../../../Events/BotEvents/autoModerationRuleEvents/autoModerationRuleCreate/log.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/autoModerationRuleEvents/autoModerationRuleCreate/log.js`
   ),
  },
 },
 autoModerationRuleDelete: {
  autoModerationRuleDelete: {
   reload: async () => {
    self.autoModerationRuleDelete.autoModerationRuleDelete.file = await import(
     `../../../../../Events/BotEvents/autoModerationRuleEvents/autoModerationRuleDelete.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/autoModerationRuleEvents/autoModerationRuleDelete/autoModerationRuleDelete.js`
   ),
  },
  log: {
   reload: async () => {
    self.autoModerationRuleDelete.log.file = await import(
     `../../../../../Events/BotEvents/autoModerationRuleEvents/autoModerationRuleDelete/log.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/autoModerationRuleEvents/autoModerationRuleDelete/log.js`
   ),
  },
 },
 autoModerationRuleUpdate: {
  autoModerationRuleUpdate: {
   reload: async () => {
    self.autoModerationRuleUpdate.autoModerationRuleUpdate.file = await import(
     `../../../../../Events/BotEvents/autoModerationRuleEvents/autoModerationRuleUpdate.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/autoModerationRuleEvents/autoModerationRuleUpdate/autoModerationRuleUpdate.js`
   ),
  },
  log: {
   reload: async () => {
    self.autoModerationRuleUpdate.log.file = await import(
     `../../../../../Events/BotEvents/autoModerationRuleEvents/autoModerationRuleUpdate/log.js?version=${Date.now()}`
    );
   },
   file: await import(
    `../../../../../Events/BotEvents/autoModerationRuleEvents/autoModerationRuleUpdate/log.js`
   ),
  },
 },
};

export default self;
