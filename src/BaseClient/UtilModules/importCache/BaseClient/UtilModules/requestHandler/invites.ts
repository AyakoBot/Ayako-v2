const self = {
 reload: async () => {
  self.file = () => import(`../../../../requestHandler/invites.js?version=${Date.now()}`);
 },
 file: () => import(`../../../../requestHandler/invites.js`),

 get: {
  reload: async () => {
   self.get.file = await import(`../../../../requestHandler/invites/get.js?version=${Date.now()}`);
  },
  file: await import(`../../../../requestHandler/invites/get.js`),
 },
 delete: {
  reload: async () => {
   self.delete.file = await import(
    `../../../../requestHandler/invites/delete.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/invites/delete.js`),
 },
};

export default self;
