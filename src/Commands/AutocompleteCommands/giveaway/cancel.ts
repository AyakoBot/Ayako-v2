import * as ch from '../../../BaseClient/ClientHelper.js';
import type * as CT from '../../../Typings/CustomTypings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 if (cmd.inGuild() && !cmd.inCachedGuild()) return [];
 if (!cmd.guild) return [];

 const messageID = cmd.options.getString('message-id', true);

 const giveaways = await ch.query(`SELECT * FROM giveaways WHERE guildid = $1;`, [cmd.guildId], {
  returnType: 'giveaways',
  asArray: true,
 });

 if (!giveaways?.length) return [];

 const giveaway = giveaways
  .filter((g) => (messageID.length ? g.msgid === messageID : true))
  .slice(0, 25);

 return giveaway.map((g) => ({ name: g.description.slice(0, 100), value: g.msgid }));
};

export default f;
