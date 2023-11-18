import * as Discord from 'discord.js';
import * as CT from '../../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.moderation.strike,
 areYouSure: (user: Discord.User, punishment: string) =>
  t.stp(t.JSON.slashCommands.moderation.strike.areYouSure, { user, punishment }),
 notEnabled: (cmdId: string) => t.stp(t.JSON.slashCommands.moderation.strike.notEnabled, { cmdId }),
});
