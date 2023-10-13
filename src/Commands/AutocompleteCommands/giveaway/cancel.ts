import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 if (!('options' in cmd)) return [];

 if (cmd.inGuild() && !cmd.inCachedGuild()) return [];
 if (!cmd.guild) return [];

 const entered = cmd.options.getString('message-id', true);

 const giveaways = await ch.DataBase.giveaways.findMany({ where: { guildid: cmd.guildId } });

 if (!giveaways?.length) return [];

 const giveaway = giveaways
  .filter((g) =>
   entered.length ? g.msgid.includes(entered) || g.description.includes(entered) : true,
  )
  .slice(0, 25);

 return giveaway.map((g) => ({ name: g.description.slice(0, 100), value: g.msgid }));
};

export default f;
