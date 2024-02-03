const self = {
 role: {
  calc: {
   reload: async () => {
    self.role.calc.file = await import(
     `../../../../../Commands/ButtonCommands/set-level/role/calc.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/set-level/role/calc.js`),
  },
  save: {
   reload: async () => {
    self.role.save.file = await import(
     `../../../../../Commands/ButtonCommands/set-level/role/save.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/set-level/role/save.js`),
  },
  zero: {
   reload: async () => {
    self.role.zero.file = await import(
     `../../../../../Commands/ButtonCommands/set-level/role/zero.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/set-level/role/zero.js`),
  },
 },
 user: {
  calc: {
   reload: async () => {
    self.user.calc.file = await import(
     `../../../../../Commands/ButtonCommands/set-level/user/calc.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/set-level/user/calc.js`),
  },
  save: {
   reload: async () => {
    self.user.save.file = await import(
     `../../../../../Commands/ButtonCommands/set-level/user/save.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/set-level/user/save.js`),
  },
  zero: {
   reload: async () => {
    self.user.zero.file = await import(
     `../../../../../Commands/ButtonCommands/set-level/user/zero.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/set-level/user/zero.js`),
  },
 },
};

export default self;
