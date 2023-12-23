import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.roles.builders,
 descReactions: (cmdId: string) =>
  t.stp(t.JSON.slashCommands.roles.builders.descReactions, {
   cmdId,
   t: t.botName,
  }),
 descButtons: (cmdId: string) =>
  t.stp(t.JSON.slashCommands.roles.builders.descButtons, {
   cmdId,
  }),
 messageNotFromMe: (cmdId: string) =>
  t.stp(t.JSON.slashCommands.roles.builders.messageNotFromMe, {
   cmdId,
  }),
});
