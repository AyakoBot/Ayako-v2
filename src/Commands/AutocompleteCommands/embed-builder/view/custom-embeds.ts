import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 const value = cmd.options.get('embed', true).value as string | null;
 const embeds = await ch.DataBase.customembeds.findMany({
  where: { guildid: cmd.guildId },
 });

 return embeds
  ?.filter((e) => (value ? e.name.includes(value) : true))
  .map((e) => ({
   name: e.name,
   value: e.uniquetimestamp.toString(),
  }));
};

export default f;
