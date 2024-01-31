const self = {
 claim: {
  version: 0,
  reload: async () => {
   self.claim.file = await import(
    `../../../../../Commands/ButtonCommands/giveaway/claim.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/giveaway/claim.js`),
 },
 list: {
  version: 0,
  reload: async () => {
   self.list.file = await import(
    `../../../../../Commands/ButtonCommands/giveaway/list.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/giveaway/list.js`),
 },
 participate: {
  version: 0,
  reload: async () => {
   self.participate.file = await import(
    `../../../../../Commands/ButtonCommands/giveaway/participate.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/giveaway/participate.js`),
 },
 reroll: {
  version: 0,
  reload: async () => {
   self.reroll.file = await import(
    `../../../../../Commands/ButtonCommands/giveaway/reroll.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/giveaway/reroll.js`),
 },
};

export default self;
