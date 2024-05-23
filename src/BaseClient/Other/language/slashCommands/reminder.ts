import * as CT from '../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.reminder,
 created: (reminderId: string) => t.stp(t.JSON.slashCommands.reminder.created, { reminderId }),
 desc: (reminderId: string | undefined) =>
  t.stp(t.JSON.slashCommands.reminder.desc, { reminderId }),
 reminderEnded: (userId: string) => t.stp(t.JSON.slashCommands.reminder.reminderEnded, { userId }),
});
