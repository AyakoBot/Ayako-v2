const self = {
 reload: async () => {
  self.file = await import(`../../../../requestHandler/webhooks.js?version=${Date.now()}`);
 },
 file: await import(`../../../../requestHandler/webhooks.js`),

 get: {
  reload: async () => {
   self.get.file = await import(`../../../../requestHandler/webhooks/get.js?version=${Date.now()}`);
  },
  file: await import(`../../../../requestHandler/webhooks/get.js`),
 },
 edit: {
  reload: async () => {
   self.edit.file = await import(
    `../../../../requestHandler/webhooks/edit.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/webhooks/edit.js`),
 },
 delete: {
  reload: async () => {
   self.delete.file = await import(
    `../../../../requestHandler/webhooks/delete.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/webhooks/delete.js`),
 },
 execute: {
  reload: async () => {
   self.execute.file = await import(
    `../../../../requestHandler/webhooks/execute.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/webhooks/execute.js`),
 },
 executeSlack: {
  reload: async () => {
   self.executeSlack.file = await import(
    `../../../../requestHandler/webhooks/executeSlack.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/webhooks/executeSlack.js`),
 },
 executeGitHub: {
  reload: async () => {
   self.executeGitHub.file = await import(
    `../../../../requestHandler/webhooks/executeGitHub.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/webhooks/executeGitHub.js`),
 },
 getMessage: {
  reload: async () => {
   self.getMessage.file = await import(
    `../../../../requestHandler/webhooks/getMessage.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/webhooks/getMessage.js`),
 },
 editMessage: {
  reload: async () => {
   self.editMessage.file = await import(
    `../../../../requestHandler/webhooks/editMessage.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/webhooks/editMessage.js`),
 },
 deleteMessage: {
  reload: async () => {
   self.deleteMessage.file = await import(
    `../../../../requestHandler/webhooks/deleteMessage.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/webhooks/deleteMessage.js`),
 },
};

export default self;
