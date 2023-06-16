import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import { getMessage, getClaimButton, getButton } from '../../SlashCommands/giveaway/end.js';

export default async (cmd: Discord.ButtonInteraction) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;
 if (!cmd.guild) return;

 const giveaway = await ch.query(
  `SELECT * FROM giveaways WHERE msgid = $1 ended = false;`,
  [cmd.message.id],
  {
   returnType: 'giveaways',
   asArray: false,
  },
 );

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.giveaway.claim;

 if (!giveaway) {
  ch.errorCmd(cmd, language.slashCommands.giveaway.notFound, language);
  return;
 }

 if (!giveaway.winners?.includes(cmd.user.id)) {
  ch.errorCmd(cmd, lan.notWinner, language);
  return;
 }

 ch.replyCmd(cmd, { content: giveaway.actualprize });

 const newWinners = giveaway.winners.filter((w) => w !== cmd.user.id);

 ch.query(`UPDATE giveaways SET winners = $1, claimingdone = $3 WHERE msgid = $2;`, [
  newWinners,
  cmd.message.id,
  !newWinners.length,
 ]);

 const collection = await ch.query(
  `SELECT * FROM giveawaycollection WHERE msgid = $1;`,
  [cmd.message.id],
  {
   returnType: 'giveawaycollection',
   asArray: false,
  },
 );

 if (newWinners.length) return;
 ch.query(`DELETE FROM giveawaycollection WHERE msgid = $1;`, [cmd.message.id]);
 ch.cache.giveawayClaimTimeout.delete(giveaway.guildid, giveaway.msgid);
 giveaway.claimingdone = true;

 const giveawayMessage = await getMessage(giveaway);
 if (giveawayMessage) {
  await giveawayMessage.edit({
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
 if (msg && msg.deletable) msg.delete().catch(() => undefined);
};
