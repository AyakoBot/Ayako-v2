const self = {
 reload: async () => {
  self.file = await import(`../../../../package.json?version=${Date.now()}`);
 },
 file: await import(`../../../../package.json`),
};

export default self;
