import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.events.logs.message,
 descDeleteAudit: (user: Discord.User, msg: Discord.Message) =>
  t.stp(t.JSON.events.logs.message.descDeleteAudit, {
   user: t.languageFunction.getUser(user),
   msg: t.languageFunction.getMessage(msg),
   author: t.languageFunction.getUser(msg.author),
  }),
 descDelete: (msg: Discord.Message) =>
  t.stp(t.JSON.events.logs.message.descDelete, {
   msg: t.languageFunction.getMessage(msg),
   author: t.languageFunction.getUser(msg.author),
  }),
 descDeleteBulkAudit: (user: Discord.User, size: number, channel: Discord.GuildTextBasedChannel) =>
  t.stp(t.JSON.events.logs.message.descDeleteBulkAudit, {
   user: t.languageFunction.getUser(user),
   size,
   channel: t.languageFunction.getChannel(channel),
  }),
 descDeleteBulk: (size: number, channel: Discord.GuildTextBasedChannel) =>
  t.stp(t.JSON.events.logs.message.descDeleteBulk, {
   size,
   channel: t.languageFunction.getChannel(channel),
  }),
 descUpdateMaybe: (msg: Discord.Message) =>
  t.stp(t.JSON.events.logs.message.descUpdateMaybe, {
   msg: t.languageFunction.getMessage(msg),
   user: t.languageFunction.getUser(msg.author),
  }),
 descUpdate: (msg: Discord.Message) =>
  t.stp(t.JSON.events.logs.message.descUpdate, {
   msg: t.languageFunction.getMessage(msg),
  }),
 descUpdateAuthor: (msg: Discord.Message) =>
  t.stp(t.JSON.events.logs.message.descUpdateAuthor, {
   msg: t.languageFunction.getMessage(msg),
   user: t.languageFunction.getUser(msg.author),
  }),
 activity: {
  1: t.JSON.events.logs.message.activity[1],
  2: t.JSON.events.logs.message.activity[2],
  3: t.JSON.events.logs.message.activity[3],
  5: t.JSON.events.logs.message.activity[5],
 },
 interaction: {
  1: t.JSON.events.logs.message.interaction[1],
  2: t.JSON.events.logs.message.interaction[2],
  3: t.JSON.events.logs.message.interaction[3],
  4: t.JSON.events.logs.message.interaction[4],
  5: t.JSON.events.logs.message.interaction[5],
 },
 type: {
  0: t.JSON.events.logs.message.type[0],
  1: t.JSON.events.logs.message.type[1],
  2: t.JSON.events.logs.message.type[2],
  3: t.JSON.events.logs.message.type[3],
  4: t.JSON.events.logs.message.type[4],
  5: t.JSON.events.logs.message.type[5],
  6: t.JSON.events.logs.message.type[6],
  7: t.JSON.events.logs.message.type[7],
  8: t.JSON.events.logs.message.type[8],
  9: t.JSON.events.logs.message.type[9],
  10: t.JSON.events.logs.message.type[10],
  11: t.JSON.events.logs.message.type[11],
  12: t.JSON.events.logs.message.type[12],
  14: t.JSON.events.logs.message.type[14],
  15: t.JSON.events.logs.message.type[15],
  16: t.JSON.events.logs.message.type[16],
  17: t.JSON.events.logs.message.type[17],
  18: t.JSON.events.logs.message.type[18],
  19: t.JSON.events.logs.message.type[19],
  20: t.JSON.events.logs.message.type[20],
  21: t.JSON.events.logs.message.type[21],
  22: t.JSON.events.logs.message.type[22],
  23: t.JSON.events.logs.message.type[23],
  24: t.JSON.events.logs.message.type[24],
  25: t.JSON.events.logs.message.type[25],
  26: t.JSON.events.logs.message.type[26],
  27: t.JSON.events.logs.message.type[27],
  28: t.JSON.events.logs.message.type[28],
  29: t.JSON.events.logs.message.type[29],
  30: t.JSON.events.logs.message.type[30],
  31: t.JSON.events.logs.message.type[31],
  32: t.JSON.events.logs.message.type[32],
 },
});
