import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.leveling,
 author: (msg: Discord.Message) => t.stp(t.JSON.leveling.author, { msg }),
 description: (reactions?: string) =>
  t.stp(t.JSON.leveling.description, {
   on: reactions ? t.JSON.leveling.on.on : t.JSON.leveling.on.normally,
   reactions: reactions
    ? t.stp(t.JSON.leveling.reactions.current, { reactions })
    : t.JSON.leveling.reactions.however,
  }),
});
