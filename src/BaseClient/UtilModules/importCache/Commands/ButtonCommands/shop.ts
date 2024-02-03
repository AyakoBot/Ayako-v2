const self = {
 buy: {
  reload: async () => {
   self.buy.file = await import(
    `../../../../../Commands/ButtonCommands/shop/buy.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/shop/buy.js`),
 },
};

export default self;
