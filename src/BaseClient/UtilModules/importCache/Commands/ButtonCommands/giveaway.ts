const self = {
 claim: {
  reload: async () => {
   self.claim.file = await import(
    `../../../../../Commands/ButtonCommands/giveaway/claim.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/giveaway/claim.js`),
 },
 list: {
  reload: async () => {
   self.list.file = await import(
    `../../../../../Commands/ButtonCommands/giveaway/list.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/giveaway/list.js`),
 },
 participate: {
  reload: async () => {
   self.participate.file = await import(
    `../../../../../Commands/ButtonCommands/giveaway/participate.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/giveaway/participate.js`),
 },
 reroll: {
  reload: async () => {
   self.reroll.file = await import(
    `../../../../../Commands/ButtonCommands/giveaway/reroll.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/giveaway/reroll.js`),
 },
};

export default self;
