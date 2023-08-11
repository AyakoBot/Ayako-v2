import * as Jobs from 'node-schedule';
import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default (msg: Discord.Message) => {
 if (!msg.inGuild()) return;

 Jobs.scheduleJob(new Date(Date.now() + 10000), () => {
  ch.DataBase.reactionrolesettings
   .findMany({
    where: { msgid: msg.id },
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
    where: { msgid: msg.id },
   })
   .then((buttonSettings) => {
    buttonSettings.forEach((buttonSetting) => {
     ch.DataBase.buttonroles
      .deleteMany({ where: { uniquetimestamp: buttonSetting.uniquetimestamp } })
      .then();
    });
   });

  ch.DataBase.buttonrolesettings.deleteMany({ where: { msgid: msg.id } }).then();
  ch.DataBase.reactionrolesettings.deleteMany({ where: { msgid: msg.id } }).then();

  ch.cache.giveaways.delete(msg.guildId, msg.channelId, msg.id);
  ch.cache.giveawayClaimTimeout.delete(msg.guildId, msg.id);

  ch.DataBase.giveawaycollection.delete({ where: { msgid: msg.id } }).then();
  ch.DataBase.giveawaycollection.delete({ where: { msgid: msg.id } }).then();
  ch.DataBase.stickymessages
   .delete({
    where: { lastmsgid: msg.id, channelid: msg.channel.id },
   })
   .then();
 });
};
