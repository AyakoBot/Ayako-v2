const self = {
 reload: async () => {
  self.file = () => import(`../../../../requestHandler/threads.js?version=${Date.now()}`);
 },
 file: () => import(`../../../../requestHandler/threads.js`),

 join: {
  reload: async () => {
   self.join.file = await import(
    `../../../../requestHandler/threads/join.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/threads/join.js`),
 },
 leave: {
  reload: async () => {
   self.leave.file = await import(
    `../../../../requestHandler/threads/leave.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/threads/leave.js`),
 },
 addMember: {
  reload: async () => {
   self.addMember.file = await import(
    `../../../../requestHandler/threads/addMember.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/threads/addMember.js`),
 },
 removeMember: {
  reload: async () => {
   self.removeMember.file = await import(
    `../../../../requestHandler/threads/removeMember.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/threads/removeMember.js`),
 },
 getAllMembers: {
  reload: async () => {
   self.getAllMembers.file = await import(
    `../../../../requestHandler/threads/getAllMembers.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/threads/getAllMembers.js`),
 },
 getMember: {
  reload: async () => {
   self.getMember.file = await import(
    `../../../../requestHandler/threads/getMember.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../requestHandler/threads/getMember.js`),
 },
};

export default self;
