import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings.js';
import * as DBT from '../../../Typings/DataBaseTypings.js';
import { getGiveawayEmbed, end, getMessage } from './end.js';
import { endTimeIsValid } from './create.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;
 if (!cmd.guild) return;

 const messageID = cmd.options.getString('message-id', true);

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.giveaway.edit;

 const giveaway = await update(messageID, cmd, language);
 if (!giveaway) {
  ch.errorCmd(cmd, lan.noChanges, language);
  return;
 }

 await ch.query(`SELECT * FROM giveaways WHERE msgid = $1 AND ended = false;`, [messageID], {
  returnType: 'giveaways',
  asArray: false,
 });

 if (!giveaway || giveaway.guildid !== cmd.guildId) {
  ch.errorCmd(cmd, language.slashCommands.giveaway.notFoundOrEnded, language);
  return;
 }

 const msg = await getMessage(giveaway);
 if (!msg) return;

 msg.edit({ embeds: [await getGiveawayEmbed(language, giveaway)] });
 ch.replyCmd(cmd, { content: lan.success });

 ch.cache.giveaways.delete(giveaway.guildid, giveaway.channelid, giveaway.msgid);
 ch.cache.giveaways.set(
  Jobs.scheduleJob(new Date(giveaway.endtime), () => {
   end(giveaway);
  }),
  giveaway.guildid,
  giveaway.channelid,
  giveaway.msgid,
 );
};

const update = async (
 messageID: string,
 cmd: Discord.ChatInputCommandInteraction,
 language: CT.Language,
) => {
 const time = cmd.options.getString('time', false);

 const prizeDesc = cmd.options.getString('prize-description', false);
 const endTime = time ? Math.abs(ch.getDuration(time)) + Date.now() : null;
 const winners = cmd.options.getInteger('winners', false);
 const role = cmd.options.getRole('role', false);
 const host = cmd.options.getUser('host', false);
 const prize = cmd.options.getString('prize', false);
 const claimingTimeout = cmd.options.getString('claiming-timeout', false);
 const claimFailReroll = cmd.options.getBoolean('claim-fail-reroll', false);

 if (
  !prizeDesc &&
  !endTime &&
  !winners &&
  !role &&
  !host &&
  !prize &&
  !claimingTimeout &&
  !claimFailReroll
 ) {
  ch.errorCmd(cmd, language.slashCommands.giveaway.edit.noOptionsProvided, language);
  return undefined;
 }

 let lastReturnedGiveaway: DBT.giveaways | undefined;

 if (prizeDesc) {
  lastReturnedGiveaway = await ch.query(
   `UPDATE giveaways SET prize = $1 WHERE msgid = $2;`,
   [prizeDesc, messageID],
   { returnType: 'giveaways', asArray: false },
  );
 }

 if (endTime && endTimeIsValid(endTime, cmd, language)) {
  lastReturnedGiveaway = await ch.query(
   `UPDATE giveaways SET endtime = $1 WHERE msgid = $2;`,
   [endTime, messageID],
   { returnType: 'giveaways', asArray: false },
  );
 }

 if (winners) {
  lastReturnedGiveaway = await ch.query(
   `UPDATE giveaways SET winnercount = $1 WHERE msgid = $2;`,
   [winners, messageID],
   { returnType: 'giveaways', asArray: false },
  );
 }

 if (role) {
  lastReturnedGiveaway = await ch.query(
   `UPDATE giveaways SET reqrole = $1 WHERE msgid = $2;`,
   [role.id, messageID],
   { returnType: 'giveaways', asArray: false },
  );
 }

 if (host) {
  lastReturnedGiveaway = await ch.query(
   `UPDATE giveaways SET host = $1 WHERE msgid = $2;`,
   [host.id, messageID],
   { returnType: 'giveaways', asArray: false },
  );
 }

 if (prize) {
  lastReturnedGiveaway = await ch.query(
   `UPDATE giveaways SET description = $1 WHERE msgid = $2;`,
   [prize, messageID],
   { returnType: 'giveaways', asArray: false },
  );
 }

 if (claimingTimeout) {
  lastReturnedGiveaway = await ch.query(
   `UPDATE giveaways SET collecttime = $1 WHERE msgid = $2;`,
   [Math.abs(ch.getDuration(claimingTimeout)), messageID],
   { returnType: 'giveaways', asArray: false },
  );
 }

 if (claimFailReroll) {
  lastReturnedGiveaway = await ch.query(
   `UPDATE giveaways SET failreroll = $1 WHERE msgid = $2;`,
   [claimFailReroll, messageID],
   { returnType: 'giveaways', asArray: false },
  );
 }

 return lastReturnedGiveaway;
};
