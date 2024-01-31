const self = {
 eevee: {
  reload: async () => {
   self.eevee.file = await import(
    `../../../../../Commands/SlashCommands/images/eevee.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/images/eevee.js`),
 },
 holo: {
  reload: async () => {
   self.holo.file = await import(
    `../../../../../Commands/SlashCommands/images/holo.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/images/holo.js`),
 },
 husbando: {
  reload: async () => {
   self.husbando.file = await import(
    `../../../../../Commands/SlashCommands/images/husbando.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/images/husbando.js`),
 },
 icon: {
  reload: async () => {
   self.icon.file = await import(
    `../../../../../Commands/SlashCommands/images/icon.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/images/icon.js`),
 },
 kitsune: {
  reload: async () => {
   self.kitsune.file = await import(
    `../../../../../Commands/SlashCommands/images/kitsune.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/images/kitsune.js`),
 },
 megumin: {
  reload: async () => {
   self.megumin.file = await import(
    `../../../../../Commands/SlashCommands/images/megumin.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/images/megumin.js`),
 },
 neko: {
  reload: async () => {
   self.neko.file = await import(
    `../../../../../Commands/SlashCommands/images/neko.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/images/neko.js`),
 },
 okami: {
  reload: async () => {
   self.okami.file = await import(
    `../../../../../Commands/SlashCommands/images/okami.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/images/okami.js`),
 },
 senko: {
  reload: async () => {
   self.senko.file = await import(
    `../../../../../Commands/SlashCommands/images/senko.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/images/senko.js`),
 },
 shinobu: {
  reload: async () => {
   self.shinobu.file = await import(
    `../../../../../Commands/SlashCommands/images/shinobu.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/images/shinobu.js`),
 },
 shiro: {
  reload: async () => {
   self.shiro.file = await import(
    `../../../../../Commands/SlashCommands/images/shiro.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/images/shiro.js`),
 },
 waifu: {
  reload: async () => {
   self.waifu.file = await import(
    `../../../../../Commands/SlashCommands/images/waifu.js?version=${Date.now()}`
   );
  },
  file: await import(`../../../../../Commands/SlashCommands/images/waifu.js`),
 },
};

export default self;
