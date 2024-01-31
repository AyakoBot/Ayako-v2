const self = {
 check: {
  page: {
   version: 0,
   reload: async () => {
    self.check.page.file = await import(
     `../../../../../Commands/ButtonCommands/mod/check/page.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/mod/check/page.js`),
  },
  select: {
   version: 0,
   reload: async () => {
    self.check.select.file = await import(
     `../../../../../Commands/ButtonCommands/mod/check/select.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/mod/check/select.js`),
  },
  type: {
   version: 0,
   reload: async () => {
    self.check.type.file = await import(
     `../../../../../Commands/ButtonCommands/mod/check/type.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/mod/check/type.js`),
  },
 },
 permissions: {
  version: 0,
  reload: async () => {
   self.permissions.file = await import(
    `../../../../../Commands/ButtonCommands/mod/permissions.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/ButtonCommands/mod/permissions.js`),
 },
};

export default self;
