const self = {
 Presence: {
  reload: async () => {
   self.Presence.file = await import(`../../../Bot/Presence.js?version=${Date.now()}`);
  },
  file: await import(`../../../Bot/Presence.js`),
 },
};

export default self;
