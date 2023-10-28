import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 const settings = (
  await ch.DataBase.shopitems.findMany({ where: { guildid: cmd.guild.id } })
 )?.filter((s) => {
  const id = 'options' in cmd ? String(cmd.options.get('id', false)?.value) : undefined;

  return id ? Number(s.uniquetimestamp).toString(36).includes(id) : true;
 });

 const language = await ch.getLanguage(cmd.guild.id);
 const lan = language.slashCommands.settings.categories['shop-items'];

 if (!settings) return [];

 return settings?.map((s) => ({
  name: `${lan.fields.price.name}: ${ch.splitByThousand(Number(s.price)) ?? language.None} - ${
   lan.fields.roles.name
  }: ${s?.roles.length ?? language.None}`,
  value: Number(s.uniquetimestamp).toString(36),
 }));
};

export default f;
