const self = {
 package: {
  reload: async () => {
   self.package.file = await import(`../../../package.json?nonce=${Date.now()}`, {
    with: { type: 'json' },
   }).then((f) => f.default);
  },
  file: await import('../../../package.json', { with: { type: 'json' } }).then((f) => f.default),
 },
 execute: {
  reload: async () => {
   self.package.file = await import(
    `../../Events/BotEvents/messageEvents/messageCreate/execute.js?nonce=${Date.now()}`
   );
  },
  file: await import('../../Events/BotEvents/messageEvents/messageCreate/execute.js'),
 },
};

export default self;
