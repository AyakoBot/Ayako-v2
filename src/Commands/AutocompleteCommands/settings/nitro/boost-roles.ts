import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 const settings = (
  await ch.DataBase.nitroroles.findMany({ where: { guildid: cmd.guildId } })
 )?.filter((s) => {
  const id = cmd.isAutocomplete() ? String(cmd.options.get('id', false)?.value) : '';

  return id ? Number(s.uniquetimestamp).toString(36).includes(id) : true;
 });

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.settings.categories['booster-roles'];

 if (!settings) return [];

 return settings?.map((s) => ({
  name: `${lan.fields.days.name}: ${s.days ?? language.None}`,
  value: Number(s.uniquetimestamp).toString(36),
 }));
};

export default f;
