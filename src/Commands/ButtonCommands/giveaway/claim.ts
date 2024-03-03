import * as Discord from 'discord.js';
import { getButton, getClaimButton, getMessage } from '../../SlashCommands/giveaway/end.js';

export default async (cmd: Discord.ButtonInteraction) => {
 if (!cmd.inCachedGuild()) return;
 if (!cmd.guild) return;

 const giveaway = await cmd.client.util.DataBase.giveaways.findUnique({
  where: { msgid: cmd.message.id, ended: true },
 });

 const giveawayCollection = await cmd.client.util.DataBase.giveawaycollection.findUnique({
  where: { msgid: cmd.message.id },
 });

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.giveaway.claim;

 if (!giveaway || !giveaway.actualprize) {
  cmd.client.util.errorCmd(cmd, language.slashCommands.giveaway.notFound, language);
  return;
 }

 if (!giveaway.winners?.includes(cmd.user.id)) {
  cmd.client.util.errorCmd(cmd, lan.notWinner, language);
  return;
 }

 cmd.client.util.replyCmd(cmd, { content: giveaway.actualprize });

 if (!giveawayCollection?.requiredwinners?.length) return;
 const newWinners = giveawayCollection.requiredwinners.filter((w) => w !== cmd.user.id);

 cmd.client.util.DataBase.giveaways
  .update({
   where: { msgid: cmd.message.id },
   data: { claimingdone: !newWinners.length },
  })
  .then();

 cmd.client.util.DataBase.giveawaycollection
  .update({
   where: { msgid: cmd.message.id },
   data: { requiredwinners: newWinners },
  })
  .then();

 const collection = await cmd.client.util.DataBase.giveawaycollection.findUnique({
  where: { msgid: cmd.message.id },
 });

 if (newWinners.length) return;

 cmd.client.util.DataBase.giveawaycollection.delete({ where: { msgid: cmd.message.id } }).then();
 cmd.client.util.cache.giveawayClaimTimeout.delete(cmd.guildId, cmd.message.id);
 giveaway.claimingdone = true;

 const giveawayMessage = await getMessage(giveaway);
 if (giveawayMessage) {
  await cmd.client.util.request.channels.editMsg(giveawayMessage, {
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

 if (msg && (await cmd.client.util.isDeleteable(msg))) {
  cmd.client.util.request.channels.deleteMessage(msg);
 }
};
