import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.afk,
 set: (user: Discord.User) => t.stp(t.JSON.slashCommands.afk.set, { user }),
 removed: (time: string) => t.stp(t.JSON.slashCommands.afk.removed, { time }),
 isAFK: (user: string, since: string, text?: string) =>
  t.stp(t.JSON.slashCommands.afk.isAFK, { user, since, text: text ?? '' }),
});
