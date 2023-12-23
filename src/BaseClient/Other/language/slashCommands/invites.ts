import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.invites,
 deleted: (invite: Discord.Invite) =>
  t.stp(t.JSON.slashCommands.invites.deleted, {
   invite: t.languageFunction.getInvite(invite),
  }),
 created: (invite: Discord.Invite) =>
  t.stp(t.JSON.slashCommands.invites.created, {
   invite: t.languageFunction.getInvite(invite),
  }),
});
