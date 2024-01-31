const self = {
 role: {
  calc: {
   version: 0,
   reload: async () => {
    self.role.calc.file = await import(
     `../../../../../Commands/ButtonCommands/set-level/role/calc.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/set-level/role/calc.js`),
  },
  save: {
   version: 0,
   reload: async () => {
    self.role.save.file = await import(
     `../../../../../Commands/ButtonCommands/set-level/role/save.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/set-level/role/save.js`),
  },
  zero: {
   version: 0,
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
   version: 0,
   reload: async () => {
    self.user.calc.file = await import(
     `../../../../../Commands/ButtonCommands/set-level/user/calc.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/set-level/user/calc.js`),
  },
  save: {
   version: 0,
   reload: async () => {
    self.user.save.file = await import(
     `../../../../../Commands/ButtonCommands/set-level/user/save.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../../Commands/ButtonCommands/set-level/user/save.js`),
  },
  zero: {
   version: 0,
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
