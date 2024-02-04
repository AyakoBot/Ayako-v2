const self = {
 all: {
  reload: async () => {
   self.all.file = await import(
    `../../../../../Commands/SlashCommands/giveaway/clear/all.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/clear/all.js`),
 },
 audio: {
  reload: async () => {
   self.audio.file = await import(
    `../../../../../Commands/SlashCommands/giveaway/clear/audio.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/clear/audio.js`),
 },
 between: {
  reload: async () => {
   self.between.file = await import(
    `../../../../../Commands/SlashCommands/giveaway/clear/between.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/clear/between.js`),
 },
 bots: {
  reload: async () => {
   self.bots.file = await import(
    `../../../../../Commands/SlashCommands/giveaway/clear/bots.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/clear/bots.js`),
 },
 embeds: {
  reload: async () => {
   self.embeds.file = await import(
    `../../../../../Commands/SlashCommands/giveaway/clear/embeds.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/clear/embeds.js`),
 },
 'ends-with': {
  reload: async () => {
   self['ends-with'].file = await import(
    `../../../../../Commands/SlashCommands/giveaway/clear/ends-with.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/clear/ends-with.js`),
 },
 files: {
  reload: async () => {
   self.files.file = await import(
    `../../../../../Commands/SlashCommands/giveaway/clear/files.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/clear/files.js`),
 },
 humans: {
  reload: async () => {
   self.humans.file = await import(
    `../../../../../Commands/SlashCommands/giveaway/clear/humans.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/clear/humans.js`),
 },
 images: {
  reload: async () => {
   self.images.file = await import(
    `../../../../../Commands/SlashCommands/giveaway/clear/images.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/clear/images.js`),
 },
 includes: {
  reload: async () => {
   self.includes.file = await import(
    `../../../../../Commands/SlashCommands/giveaway/clear/includes.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/clear/includes.js`),
 },
 invites: {
  reload: async () => {
   self.invites.file = await import(
    `../../../../../Commands/SlashCommands/giveaway/clear/invites.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/clear/invites.js`),
 },
 links: {
  reload: async () => {
   self.links.file = await import(
    `../../../../../Commands/SlashCommands/giveaway/clear/links.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/clear/links.js`),
 },
 match: {
  reload: async () => {
   self.match.file = await import(
    `../../../../../Commands/SlashCommands/giveaway/clear/match.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/clear/match.js`),
 },
 mentions: {
  reload: async () => {
   self.mentions.file = await import(
    `../../../../../Commands/SlashCommands/giveaway/clear/mentions.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/clear/mentions.js`),
 },
 'not-match': {
  reload: async () => {
   self['not-match'].file = await import(
    `../../../../../Commands/SlashCommands/giveaway/clear/not-match.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/clear/not-match.js`),
 },
 'starts-with': {
  reload: async () => {
   self['starts-with'].file = await import(
    `../../../../../Commands/SlashCommands/giveaway/clear/starts-with.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/clear/starts-with.js`),
 },
 stickers: {
  reload: async () => {
   self.stickers.file = await import(
    `../../../../../Commands/SlashCommands/giveaway/clear/stickers.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/clear/stickers.js`),
 },
 text: {
  reload: async () => {
   self.text.file = await import(
    `../../../../../Commands/SlashCommands/giveaway/clear/text.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/clear/text.js`),
 },
 user: {
  reload: async () => {
   self.user.file = await import(
    `../../../../../Commands/SlashCommands/giveaway/clear/user.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/clear/user.js`),
 },
 videos: {
  reload: async () => {
   self.videos.file = await import(
    `../../../../../Commands/SlashCommands/giveaway/clear/videos.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/clear/videos.js`),
 },
};

export default self;
