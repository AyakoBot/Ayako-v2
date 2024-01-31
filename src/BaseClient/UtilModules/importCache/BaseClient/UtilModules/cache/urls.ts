const self = {
 fishFish: {
  reload: async () => {
   self.fishFish.file = await import(`../../../../cache/urls/fishFish.js?version=${Date.now()}`);
  },
  file: await import(`../../../../cache/urls/fishFish.js`),
 },
 sinkingYachts: {
  reload: async () => {
   self.sinkingYachts.file = await import(
    `../../../../cache/urls/sinkingYachts.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../cache/urls/sinkingYachts.js`),
 },
 urlTLDs: {
  reload: async () => {
   self.urlTLDs.file = await import(`../../../../cache/urls/urlTLDs.js?version=${Date.now()}`);
  },
  file: await import(`../../../../cache/urls/urlTLDs.js`),
 },
};

export default self;
