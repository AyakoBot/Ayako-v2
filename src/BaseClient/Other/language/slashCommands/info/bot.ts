import type * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.info.bot,
 author: t.stp(t.JSON.slashCommands.info.bot.author, { t }),
 base: t.stp(t.JSON.slashCommands.info.bot.base, {
  base: t.botId === process.env.mainID ? ' ' : `(${t.JSON.slashCommands.info.bot.thisBase}) `,
  version: t.client.util.importCache.pack.file.version,
 }),
});
