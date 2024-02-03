const self = {
 page: {
  reload: async () => {
   self.page.file = await import(
    `../../../../../Commands/ButtonCommands/server/page.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/server/page.js`),
 },
 select: {
  reload: async () => {
   self.select.file = await import(
    `../../../../../Commands/ButtonCommands/server/select.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/server/select.js`),
 },
};

export default self;
