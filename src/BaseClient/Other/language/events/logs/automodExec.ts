import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.events.logs.automodExec,
 descMessage: (rule: Discord.AutoModerationRule, msg: Discord.Message, user: Discord.User | Discord.PartialUser) =>
  t.stp(t.JSON.events.logs.automodExec.descMessage, {
   rule: t.languageFunction.getAutoModerationRule(rule),
   msg: t.languageFunction.getMessage(msg),
   user: t.languageFunction.getUser(user),
  }),
 desc: (rule: Discord.AutoModerationRule, user: Discord.User | Discord.PartialUser) =>
  t.stp(t.JSON.events.logs.automodExec.desc, {
   rule: t.languageFunction.getAutoModerationRule(rule),
   user: t.languageFunction.getUser(user),
  }),
 descChannel: (rule: Discord.AutoModerationRule, user: Discord.User | Discord.PartialUser, channel: Discord.Channel) =>
  t.stp(t.JSON.events.logs.automodExec.descChannel, {
   rule: t.languageFunction.getAutoModerationRule(rule),
   user: t.languageFunction.getUser(user),
   channel: t.languageFunction.getChannel(channel, t.JSON.channelTypes[channel.type]),
  }),
 ruleTriggerType: {
  1: t.JSON.events.logs.automodExec.ruleTriggerType[1],
  3: t.JSON.events.logs.automodExec.ruleTriggerType[3],
  4: t.JSON.events.logs.automodExec.ruleTriggerType[4],
  5: t.JSON.events.logs.automodExec.ruleTriggerType[5],
  6: t.JSON.events.logs.automodExec.ruleTriggerType[6],
 },
 actionType: {
  1: t.JSON.events.logs.automodExec.actionType[1],
  2: t.JSON.events.logs.automodExec.actionType[2],
  3: t.JSON.events.logs.automodExec.actionType[3],
  4: t.JSON.events.logs.automodExec.actionType[4],
 },
});
