const self = {
 reload: async () => {
  self.file = await import(`../../../../package.json?version=${Date.now()}`, {
   assert: { type: 'json' },
  });
 },
 file: await import(`../../../../package.json`, { assert: { type: 'json' } }),
};

export default self;
