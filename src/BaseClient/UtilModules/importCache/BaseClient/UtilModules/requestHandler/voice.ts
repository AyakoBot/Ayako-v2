const self = {
 reload: async () => {
  self.file = () => import(`../../../../requestHandler/voice.js?version=${Date.now()}`);
 },
 file: () => import(`../../../../requestHandler/voice.js`),

 getVoiceRegions: {
  reload: async () => {
   self.getVoiceRegions.file = await import(
    `../../../../requestHandler/voice/getVoiceRegions.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/voice/getVoiceRegions.js`),
 },
};

export default self;
