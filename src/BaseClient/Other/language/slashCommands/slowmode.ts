import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.slowmode,
 deleted: (channel: Discord.GuildChannel) =>
  t.stp(t.JSON.slashCommands.slowmode.deleted, { channel }),
 success: (channel: Discord.GuildChannel, time: string) =>
  t.stp(t.JSON.slashCommands.slowmode.success, { channel, time }),
});
