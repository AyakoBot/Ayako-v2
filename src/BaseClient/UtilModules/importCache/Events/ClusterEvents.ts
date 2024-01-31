const self = {
 voteEvents: {
  vote: {
   reload: async () => {
    self.voteEvents.vote.file = await import(
     `../../../../Events/ClusterEvents/voteEvents/vote.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../Events/ClusterEvents/voteEvents/vote.js`),
  },
  voteBotCreate: {
   reload: async () => {
    self.voteEvents.voteBotCreate.file = await import(
     `../../../../Events/ClusterEvents/voteEvents/voteBotCreate.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../Events/ClusterEvents/voteEvents/voteBotCreate.js`),
  },
  voteGuildCreate: {
   reload: async () => {
    self.voteEvents.voteGuildCreate.file = await import(
     `../../../../Events/ClusterEvents/voteEvents/voteGuildCreate.js?version=${Date.now()}`
    );
   },
   file: await import(`../../../../Events/ClusterEvents/voteEvents/voteGuildCreate.js`),
  },
 },
 appeal: {
  reload: async () => {
   self.appeal.file = await import(
    `../../../../Events/ClusterEvents/appeal.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../Events/ClusterEvents/appeal.js`),
 },
 interaction: {
  reload: async () => {
   self.interaction.file = await import(
    `../../../../Events/ClusterEvents/interaction.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../Events/ClusterEvents/interaction.js`),
 },
};

export default self;
