// @ts-ignore
import * as CT from '../../../../../Typings/Typings.js';
import packageJSON from '../../../../../../package.json' assert { type: 'json' };
import * as ch from '../../../../ClientHelper.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.info.bot,
 author: t.stp(t.JSON.slashCommands.info.bot.author, { t }),
 base: t.stp(t.JSON.slashCommands.info.bot.base, {
  base: t.botId === ch.mainID ? '' : `(${t.JSON.slashCommands.info.bot.thisBase})`,
  version: packageJSON.version,
 }),
});
