import * as Discord from 'discord.js';

export default async (channel: Discord.Channel) => {
 if (channel.isDMBased()) return;

 const giveaways = channel.client.util.cache.giveaways.cache.get(channel.guildId)?.get(channel.id);
 if (giveaways) {
  Array.from(giveaways, ([g]) => g).forEach((g) => {
   channel.client.util.DataBase.giveawaycollection.deleteMany({ where: { msgid: g } }).then();

   channel.client.util.cache.giveaways.delete(channel.guildId, channel.id, g);
   channel.client.util.cache.giveaways.cache.get(channel.guildId)?.delete(g);
   channel.client.util.cache.giveawayClaimTimeout.delete(channel.guildId, g);
  });
 }

 channel.client.util.DataBase.reactionrolesettings
  .findMany({
   where: { channelid: channel.id },
  })
  .then((reactionSettings) => {
   reactionSettings.forEach((reactionSetting) => {
    channel.client.util.DataBase.reactionroles
     .deleteMany({ where: { uniquetimestamp: reactionSetting.uniquetimestamp } })
     .then();
   });
  });

 channel.client.util.DataBase.buttonrolesettings
  .findMany({
   where: { channelid: channel.id },
  })
  .then((buttonSettings) => {
   buttonSettings.forEach((buttonSetting) => {
    channel.client.util.DataBase.buttonroles
     .deleteMany({ where: { uniquetimestamp: buttonSetting.uniquetimestamp } })
     .then();
   });
  });

 channel.client.util.DataBase.buttonrolesettings
  .deleteMany({ where: { channelid: channel.id } })
  .then();
 channel.client.util.DataBase.reactionrolesettings
  .deleteMany({ where: { channelid: channel.id } })
  .then();
 channel.client.util.DataBase.shopitems.deleteMany({ where: { channelid: channel.id } }).then();

 channel.client.util.DataBase.giveaways.deleteMany({ where: { channelid: channel.id } }).then();
 channel.client.util.DataBase.stickymessages
  .deleteMany({ where: { channelid: channel.id } })
  .then();

 const suggestions = await channel.client.util.DataBase.suggestionvotes.findMany({
  where: { channelid: channel.id },
 });
 suggestions.forEach((s) => {
  channel.client.util.cache.deleteSuggestions.delete(s.guildid, s.msgid);
 });
 channel.client.util.DataBase.suggestionvotes
  .deleteMany({ where: { channelid: channel.id } })
  .then();

 channel.client.util.cache.vcDeleteTimeout.delete(channel.guildId, channel.id);
 channel.client.util.DataBase.voicechannels.deleteMany({ where: { channelid: channel.id } }).then();
};
