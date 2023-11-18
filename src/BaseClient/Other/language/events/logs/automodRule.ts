import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.events.logs.automodRule,
 descCreate: (user: Discord.User, rule: Discord.AutoModerationRule) =>
  t.stp(t.JSON.events.logs.automodRule.descCreate, {
   user: t.languageFunction.getUser(user),
   rule: t.languageFunction.getAutoModerationRule(rule),
  }),
 descDelete: (user: Discord.User, rule: Discord.AutoModerationRule) =>
  t.stp(t.JSON.events.logs.automodRule.descDelete, {
   user: t.languageFunction.getUser(user),
   rule: t.languageFunction.getAutoModerationRule(rule),
  }),
 descUpdate: (user: Discord.User, rule: Discord.AutoModerationRule) =>
  t.stp(t.JSON.events.logs.automodRule.descUpdate, {
   user: t.languageFunction.getUser(user),
   rule: t.languageFunction.getAutoModerationRule(rule),
  }),
 presets: {
  1: t.JSON.events.logs.automodRule.presets[1],
  2: t.JSON.events.logs.automodRule.presets[2],
  3: t.JSON.events.logs.automodRule.presets[3],
 },
 eventType: {
  1: t.JSON.events.logs.automodRule.eventType[1],
  2: t.JSON.events.logs.automodRule.eventType[2],
 },
 triggerType: {
  1: t.JSON.events.logs.automodRule.triggerType[1],
  2: t.JSON.events.logs.automodRule.triggerType[2],
  3: t.JSON.events.logs.automodRule.triggerType[3],
  4: t.JSON.events.logs.automodRule.triggerType[4],
  5: t.JSON.events.logs.automodRule.triggerType[5],
 },
 actionsType: {
  1: t.JSON.events.logs.automodRule.actionsType[1],
  2: t.JSON.events.logs.automodRule.actionsType[2],
  3: t.JSON.events.logs.automodRule.actionsType[3],
  4: t.JSON.events.logs.automodRule.actionsType[4],
 },
});
