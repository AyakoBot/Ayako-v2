// @ts-ignore
import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.info.bot,
 author: t.stp(t.JSON.slashCommands.info.bot.author, { t }),
 base: t.stp(t.JSON.slashCommands.info.bot.base, {
  base: t.botId === t.util.mainID ? ' ' : `(${t.JSON.slashCommands.info.bot.thisBase}) `,
  version: t.util.files.importCache.package.file.version,
 }),
});
