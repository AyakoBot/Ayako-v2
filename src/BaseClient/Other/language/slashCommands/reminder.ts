import * as CT from '../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.reminder,
 created: (reminderID: string) => t.stp(t.JSON.slashCommands.reminder.created, { reminderID }),
 desc: (reminderID: string | undefined) =>
  t.stp(t.JSON.slashCommands.reminder.desc, { reminderID }),
 reminderEnded: (userId: string) => t.stp(t.JSON.slashCommands.reminder.reminderEnded, { userId }),
});
