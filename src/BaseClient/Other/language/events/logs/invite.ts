import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.events.logs.invite,
 descCreateAudit: (user: Discord.User, invite: Discord.Invite) =>
  t.stp(t.JSON.events.logs.invite.descCreateAudit, {
   user: t.languageFunction.getUser(user),
   invite: t.languageFunction.getInvite(invite),
  }),
 descCreate: (invite: Discord.Invite) =>
  t.stp(t.JSON.events.logs.invite.descCreate, {
   invite: t.languageFunction.getInvite(invite),
  }),
 descDeleteAudit: (user: Discord.User, invite: Discord.Invite) =>
  t.stp(t.JSON.events.logs.invite.descDeleteAudit, {
   user: t.languageFunction.getUser(user),
   invite: t.languageFunction.getInvite(invite),
  }),
 descDelete: (invite: Discord.Invite) =>
  t.stp(t.JSON.events.logs.invite.descDelete, {
   invite: t.languageFunction.getInvite(invite),
  }),
 targetType: {
  1: t.JSON.events.logs.invite.targetType[1],
  2: t.JSON.events.logs.invite.targetType[2],
 },
});
