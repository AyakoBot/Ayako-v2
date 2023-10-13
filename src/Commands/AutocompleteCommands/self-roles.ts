import * as ch from '../../BaseClient/ClientHelper.js';
import * as CT from '../../Typings/CustomTypings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 const category = 'options' in cmd ? String(cmd.options.get('category', false)?.value) : undefined;

 const settings = await ch.DataBase.selfroles.findMany({
  where: { name: { contains: category, mode: 'insensitive' }, guildid: cmd.guild.id },
 });

 return settings.map((s) => ({ name: s.name, value: String(s.uniquetimestamp) }));
};

export default f;
