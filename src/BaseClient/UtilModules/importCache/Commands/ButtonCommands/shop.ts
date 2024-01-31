const self = {
 buy: {
  version: 0,
  reload: async () => {
   self.buy.file = await import(
    `../../../../../Commands/ButtonCommands/shop/buy.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/shop/buy.js`),
 },
};

export default self;
