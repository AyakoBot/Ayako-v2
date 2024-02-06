const self = {
 reload: async () => {
  self.file = () => import(`../../../../requestHandler/stageInstances.js?version=${Date.now()}`);
 },
 file: () => import(`../../../../requestHandler/stageInstances.js`),

 get: {
  reload: async () => {
   self.get.file = await import(
    `../../../../requestHandler/stageInstances/get.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/stageInstances/get.js`),
 },
 create: {
  reload: async () => {
   self.create.file = await import(
    `../../../../requestHandler/stageInstances/create.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/stageInstances/create.js`),
 },
 edit: {
  reload: async () => {
   self.edit.file = await import(
    `../../../../requestHandler/stageInstances/edit.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/stageInstances/edit.js`),
 },
 delete: {
  reload: async () => {
   self.delete.file = await import(
    `../../../../requestHandler/stageInstances/delete.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/stageInstances/delete.js`),
 },
};

export default self;
