import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default (channel: Discord.Channel) => {
 if (channel.isDMBased()) return;

 const giveaways = ch.cache.giveaways.cache.get(channel.guildId);
 if (giveaways) {
  Array.from(giveaways, ([, g]) => g)
   .map((g) => g.keys())
   .forEach((g) => {
    ch.query(`DELETE FROM giveawaycollection WHERE msgid = $1;`, [g]);
   });
 }

 ch.query(`DELETE FROM giveaways WHERE channelid = $1;`, [channel.id]);
 ch.query(`DELETE FROM stickymessages WHERE channelid = $1;`, [channel.id]);
};
