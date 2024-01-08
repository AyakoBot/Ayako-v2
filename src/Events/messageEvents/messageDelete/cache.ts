import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';

export default (msg: Discord.Message) => {
 if (!msg.inGuild()) return;

 Jobs.scheduleJob(new Date(Date.now() + 10000), () => {
  msg.client.util.DataBase.reactionrolesettings
   .findMany({
    where: { msgid: msg.id },
   })
   .then((reactionSettings) => {
    reactionSettings?.forEach((reactionSetting) => {
     msg.client.util.DataBase.reactionroles
      .deleteMany({ where: { uniquetimestamp: reactionSetting.uniquetimestamp } })
      .then();
    });
   });

  msg.client.util.DataBase.buttonrolesettings
   .findMany({
    where: { msgid: msg.id },
   })
   .then((buttonSettings) => {
    buttonSettings?.forEach((buttonSetting) => {
     msg.client.util.DataBase.buttonroles
      .deleteMany({ where: { uniquetimestamp: buttonSetting.uniquetimestamp } })
      .then();
    });
   });

  msg.client.util.DataBase.buttonrolesettings.deleteMany({ where: { msgid: msg.id } }).then();
  msg.client.util.DataBase.reactionrolesettings.deleteMany({ where: { msgid: msg.id } }).then();
  msg.client.util.DataBase.shopitems.deleteMany({ where: { msgid: msg.id } }).then();

  msg.client.util.cache.giveaways.delete(msg.guildId, msg.channelId, msg.id);
  msg.client.util.cache.giveawayClaimTimeout.delete(msg.guildId, msg.id);

  msg.client.util.DataBase.giveawaycollection.delete({ where: { msgid: msg.id } }).then();
  msg.client.util.DataBase.giveawaycollection.delete({ where: { msgid: msg.id } }).then();

  msg.client.util.DataBase.stickymessages
   .delete({ where: { lastmsgid: msg.id, channelid: msg.channelId } })
   .then();
 });
 const stickyMsgJob = msg.client.util.cache.stickyTimeouts.find(msg.id);
 if (stickyMsgJob) {
  stickyMsgJob.job.cancel();
  msg.client.util.cache.stickyTimeouts.delete(msg.channelId);
 }

 msg.client.util.DataBase.suggestionvotes.delete({ where: { msgid: msg.id } }).then();
 msg.client.util.cache.deleteSuggestions.delete(msg.guildId, msg.id);
};
