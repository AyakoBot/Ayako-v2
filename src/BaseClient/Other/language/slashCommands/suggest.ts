import * as Discord from 'discord.js';
import * as ch from '../../../ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.suggest,
 banned: (user: Discord.User) =>
  t.stp(t.JSON.slashCommands.suggest.banned, { user: t.languageFunction.getUser(user) }),
 cantBan: (cmdId: string) => t.stp(t.JSON.slashCommands.suggest.cantBan, { cmdId }),
 sent: t.stp(t.JSON.slashCommands.suggest.sent, {
  trash: ch.constants.standard.getEmote(ch.emotes.trash),
 }),
 author: t.stp(t.JSON.slashCommands.suggest.author, { t }),
});
