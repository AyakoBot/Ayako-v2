import Prisma from '@prisma/client';
import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import * as CT from '../../../Typings/Typings.js';
import { endTimeIsValid } from './create.js';
import { end, getGiveawayEmbed, getMessage } from './end.js';
import getPathFromError from '../../../BaseClient/UtilModules/getPathFromError.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const messageId = cmd.options.getString('message-id', true);

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.giveaway.edit;

 const giveaway = await update(messageId, cmd, language);
 if (!giveaway) {
  cmd.client.util.errorCmd(cmd, lan.noChanges, language);
  return;
 }

 if (!giveaway || giveaway.guildid !== cmd.guildId) {
  cmd.client.util.errorCmd(cmd, language.slashCommands.giveaway.notFoundOrEnded, language);
  return;
 }

 const msg = await getMessage(giveaway);
 if (!msg) return;

 const res = await cmd.client.util.request.channels.editMsg(msg, {
  embeds: [await getGiveawayEmbed(language, giveaway)],
 });

 if ('message' in res) {
  cmd.client.util.errorCmd(cmd, res, language);
  return;
 }

 cmd.client.util.replyCmd(cmd, { content: lan.success });

 cmd.client.util.cache.giveaways.delete(giveaway.guildid, giveaway.channelid, giveaway.msgid);
 cmd.client.util.cache.giveaways.set(
  Jobs.scheduleJob(
   getPathFromError(new Error(giveaway.msgid)),
   new Date(Number(giveaway.endtime)),
   () => {
    end(giveaway);
   },
  ),
  giveaway.guildid,
  giveaway.channelid,
  giveaway.msgid,
 );
};

const update = async (
 messageId: string,
 cmd: Discord.ChatInputCommandInteraction,
 language: CT.Language,
) => {
 const time = cmd.options.getString('time', false);

 const prizeDesc = cmd.options.getString('prize-description', false);
 const endTime = time ? Math.abs(cmd.client.util.getDuration(time)) + Date.now() : null;
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
  cmd.client.util.errorCmd(cmd, language.slashCommands.giveaway.edit.noOptionsProvided, language);
  return undefined;
 }

 let lastReturnedGiveaway: Prisma.giveaways | undefined;

 if (prizeDesc) {
  lastReturnedGiveaway = await cmd.client.util.DataBase.giveaways.update({
   where: { msgid: messageId },
   data: { description: prizeDesc },
  });
 }

 if (endTime && endTimeIsValid(endTime, cmd, language)) {
  lastReturnedGiveaway = await cmd.client.util.DataBase.giveaways.update({
   where: { msgid: messageId },
   data: { endtime: endTime },
  });
 }

 if (winners) {
  lastReturnedGiveaway = await cmd.client.util.DataBase.giveaways.update({
   where: { msgid: messageId },
   data: { winnercount: winners },
  });
 }

 if (role) {
  lastReturnedGiveaway = await cmd.client.util.DataBase.giveaways.update({
   where: { msgid: messageId },
   data: { reqrole: role.id },
  });
 }

 if (host) {
  lastReturnedGiveaway = await cmd.client.util.DataBase.giveaways.update({
   where: { msgid: messageId },
   data: { host: host.id },
  });
 }

 if (prize) {
  lastReturnedGiveaway = await cmd.client.util.DataBase.giveaways.update({
   where: { msgid: messageId },
   data: { actualprize: prize },
  });
 }

 if (claimingTimeout) {
  lastReturnedGiveaway = await cmd.client.util.DataBase.giveaways.update({
   where: { msgid: messageId },
   data: { collecttime: Math.abs(cmd.client.util.getDuration(claimingTimeout)) },
  });
 }

 if (claimFailReroll) {
  lastReturnedGiveaway = await cmd.client.util.DataBase.giveaways.update({
   where: { msgid: messageId },
   data: { failreroll: claimFailReroll },
  });
 }

 return lastReturnedGiveaway;
};
