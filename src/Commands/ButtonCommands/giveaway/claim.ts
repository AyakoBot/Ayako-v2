import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import { getMessage, getClaimButton, getButton } from '../../SlashCommands/giveaway/end.js';
import { request } from '../../../BaseClient/ClientHelperModules/requestHandler.js';

export default async (cmd: Discord.ButtonInteraction) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;
 if (!cmd.guild) return;

 const giveaway = await ch.DataBase.giveaways.findUnique({
  where: { msgid: cmd.message.id, ended: true },
 });

 const giveawayCollection = await ch.DataBase.giveawaycollection.findUnique({
  where: { msgid: cmd.message.id },
 });

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.giveaway.claim;

 if (!giveaway || !giveaway.actualprize) {
  ch.errorCmd(cmd, language.slashCommands.giveaway.notFound, language);
  return;
 }

 if (!giveaway.winners?.includes(cmd.user.id)) {
  ch.errorCmd(cmd, lan.notWinner, language);
  return;
 }

 ch.replyCmd(cmd, { content: giveaway.actualprize });

 if (!giveawayCollection?.requiredwinners?.length) return;
 const newWinners = giveawayCollection.requiredwinners.filter((w) => w !== cmd.user.id);

 ch.DataBase.giveaways
  .update({
   where: { msgid: cmd.message.id },
   data: { claimingdone: !newWinners.length },
  })
  .then();

 ch.DataBase.giveawaycollection
  .update({
   where: { msgid: cmd.message.id },
   data: { requiredwinners: newWinners },
  })
  .then();

 const collection = await ch.DataBase.giveawaycollection.findUnique({
  where: { msgid: cmd.message.id },
 });

 if (newWinners.length) return;
 ch.DataBase.giveawaycollection.delete({ where: { msgid: cmd.message.id } }).then();
 ch.cache.giveawayClaimTimeout.delete(giveaway.guildid, giveaway.msgid);
 giveaway.claimingdone = true;

 const giveawayMessage = await getMessage(giveaway);
 if (giveawayMessage) {
  await request.channels.editMsg(giveawayMessage, {
   components: [
    {
     type: Discord.ComponentType.ActionRow,
     components: [
      getButton(language, giveaway),
      giveaway.actualprize && giveaway.collecttime ? getClaimButton(language, giveaway) : undefined,
     ].filter((r): r is Discord.APIButtonComponent => !!r),
    },
   ],
  });
 }

 if (!collection) return;
 const msg = await getMessage({
  channelid: giveaway.channelid,
  msgid: collection.replymsgid,
  guildid: giveaway.guildid,
 });
 if (msg && msg.deletable) request.channels.deleteMessage(msg);
};
