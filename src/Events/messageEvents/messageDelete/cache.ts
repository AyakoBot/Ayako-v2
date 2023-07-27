import * as Jobs from 'node-schedule';
import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default (msg: Discord.Message) => {
 if (!msg.inGuild()) return;

 Jobs.scheduleJob(new Date(Date.now() + 10000), () => {
  ch.cache.giveaways.delete(msg.guildId, msg.channelId, msg.id);
  ch.cache.giveawayClaimTimeout.delete(msg.guildId, msg.id);

  ch.DataBase.giveawaycollection.delete({ where: { msgid: msg.id } });
  ch.DataBase.giveawaycollection.delete({ where: { msgid: msg.id } });
  ch.DataBase.stickymessages.delete({
   where: { lastmsgid: msg.id, channelid: msg.channel.id },
  });
 });
};
