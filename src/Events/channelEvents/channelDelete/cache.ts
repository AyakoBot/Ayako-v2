import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (channel: Discord.Channel) => {
 if (channel.isDMBased()) return;

 const giveaways = ch.cache.giveaways.cache.get(channel.guildId)?.get(channel.id);
 if (giveaways) {
  Array.from(giveaways, ([g]) => g).forEach((g) => {
   ch.DataBase.giveawaycollection.deleteMany({ where: { msgid: g } }).then();

   ch.cache.giveaways.delete(channel.guildId, channel.id, g);
   ch.cache.giveaways.cache.get(channel.guildId)?.delete(g);
   ch.cache.giveawayClaimTimeout.delete(channel.guildId, g);
  });
 }

 ch.DataBase.reactionrolesettings
  .findMany({
   where: { channelid: channel.id },
  })
  .then((reactionSettings) => {
   reactionSettings.forEach((reactionSetting) => {
    ch.DataBase.reactionroles
     .deleteMany({ where: { uniquetimestamp: reactionSetting.uniquetimestamp } })
     .then();
   });
  });

 ch.DataBase.buttonrolesettings
  .findMany({
   where: { channelid: channel.id },
  })
  .then((buttonSettings) => {
   buttonSettings.forEach((buttonSetting) => {
    ch.DataBase.buttonroles
     .deleteMany({ where: { uniquetimestamp: buttonSetting.uniquetimestamp } })
     .then();
   });
  });

 ch.DataBase.buttonrolesettings.deleteMany({ where: { channelid: channel.id } }).then();
 ch.DataBase.reactionrolesettings.deleteMany({ where: { channelid: channel.id } }).then();
 ch.DataBase.shopitems.deleteMany({ where: { channelid: channel.id } }).then();

 ch.DataBase.giveaways.deleteMany({ where: { channelid: channel.id } }).then();
 ch.DataBase.stickymessages.deleteMany({ where: { channelid: channel.id } }).then();

 const suggestions = await ch.DataBase.suggestionvotes.findMany({
  where: { channelid: channel.id },
 });
 suggestions.forEach((s) => {
  ch.cache.deleteSuggestions.delete(s.guildid, s.msgid);
 });
 ch.DataBase.suggestionvotes.deleteMany({ where: { channelid: channel.id } }).then();

 ch.cache.vcDeleteTimeout.delete(channel.guildId, channel.id);
 ch.DataBase.voicechannels.deleteMany({ where: { channelid: channel.id } }).then();
};
