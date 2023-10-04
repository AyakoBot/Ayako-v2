import * as ch from '../../BaseClient/ClientHelper.js';
import * as CT from '../../Typings/CustomTypings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 const category = cmd.options.getString('category', true);

 const settings = await ch.DataBase.selfroles.findMany({
  where: { name: { contains: category, mode: 'insensitive' }, guildid: cmd.guildId },
 });

 return settings.map((s) => ({ name: s.name, value: String(s.uniquetimestamp) }));
};

export default f;
