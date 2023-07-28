import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default (channel: Discord.Channel) => {
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

 ch.DataBase.giveaways.deleteMany({ where: { channelid: channel.id } }).then();
 ch.DataBase.stickymessages.deleteMany({ where: { channelid: channel.id } }).then();
};
