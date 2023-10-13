import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 const settings = (
  await ch.DataBase.roleseparator.findMany({ where: { guildid: cmd.guild.id } })
 )?.filter((s) => {
  const id = 'options' in cmd ? String(cmd.options.get('id', false)?.value) : undefined;

  return id ? Number(s.uniquetimestamp).toString(36).includes(id) : true;
 });

 if (!settings) return [];

 return settings?.map((s) => ({
  name: `ID: ${Number(s.uniquetimestamp).toString(36)}`,
  value: Number(s.uniquetimestamp).toString(36),
 }));
};

export default f;
