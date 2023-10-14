import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import Prisma from '@prisma/client';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings.js';
import { getGiveawayEmbed, end, getMessage } from './end.js';
import { endTimeIsValid } from './create.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;
 if (!cmd.guild) return;

 const messageID = cmd.options.getString('message-id', true);

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.giveaway.edit;

 const giveaway = await update(messageID, cmd, language);
 if (!giveaway) {
  ch.errorCmd(cmd, lan.noChanges, language);
  return;
 }

 if (!giveaway || giveaway.guildid !== cmd.guildId) {
  ch.errorCmd(cmd, language.slashCommands.giveaway.notFoundOrEnded, language);
  return;
 }

 const msg = await getMessage(giveaway);
 if (!msg) return;

 const res = await ch.request.channels.editMsg(msg, {
  embeds: [await getGiveawayEmbed(language, giveaway)],
 });

 if ('message' in res) {
  ch.errorCmd(cmd, res, language);
  return;
 }

 ch.replyCmd(cmd, { content: lan.success });

 ch.cache.giveaways.delete(giveaway.guildid, giveaway.channelid, giveaway.msgid);
 ch.cache.giveaways.set(
  Jobs.scheduleJob(new Date(Number(giveaway.endtime)), () => {
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

 let lastReturnedGiveaway: Prisma.giveaways | undefined;

 if (prizeDesc) {
  lastReturnedGiveaway = await ch.DataBase.giveaways.update({
   where: { msgid: messageID },
   data: { description: prizeDesc },
  });
 }

 if (endTime && endTimeIsValid(endTime, cmd, language)) {
  lastReturnedGiveaway = await ch.DataBase.giveaways.update({
   where: { msgid: messageID },
   data: { endtime: endTime },
  });
 }

 if (winners) {
  lastReturnedGiveaway = await ch.DataBase.giveaways.update({
   where: { msgid: messageID },
   data: { winnercount: winners },
  });
 }

 if (role) {
  lastReturnedGiveaway = await ch.DataBase.giveaways.update({
   where: { msgid: messageID },
   data: { reqrole: role.id },
  });
 }

 if (host) {
  lastReturnedGiveaway = await ch.DataBase.giveaways.update({
   where: { msgid: messageID },
   data: { host: host.id },
  });
 }

 if (prize) {
  lastReturnedGiveaway = await ch.DataBase.giveaways.update({
   where: { msgid: messageID },
   data: { actualprize: prize },
  });
 }

 if (claimingTimeout) {
  lastReturnedGiveaway = await ch.DataBase.giveaways.update({
   where: { msgid: messageID },
   data: { collecttime: Math.abs(ch.getDuration(claimingTimeout)) },
  });
 }

 if (claimFailReroll) {
  lastReturnedGiveaway = await ch.DataBase.giveaways.update({
   where: { msgid: messageID },
   data: { failreroll: claimFailReroll },
  });
 }

 return lastReturnedGiveaway;
};
