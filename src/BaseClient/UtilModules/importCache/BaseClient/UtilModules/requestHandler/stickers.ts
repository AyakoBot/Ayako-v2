const self = {
 reload: async () => {
  self.file = await import(`../../../../requestHandler/stickers.js?version=${Date.now()}`);
 },
 file: await import(`../../../../requestHandler/stickers.js`),

 getNitroStickers: {
  reload: async () => {
   self.getNitroStickers.file = await import(
    `../../../../requestHandler/stickers/getNitroStickers.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/stickers/getNitroStickers.js`),
 },
 get: {
  reload: async () => {
   self.get.file = await import(`../../../../requestHandler/stickers/get.js?version=${Date.now()}`);
  },
  file: await import(`../../../../requestHandler/stickers/get.js`),
 },
};

export default self;
