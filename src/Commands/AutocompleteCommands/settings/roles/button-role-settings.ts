import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 const settings = (
  await ch.DataBase.buttonrolesettings.findMany({ where: { guildid: cmd.guildId } })
 )?.filter((s) => {
  const id = String(cmd.options.get('id', false)?.value);

  return id ? Number(s.uniquetimestamp).toString(36).includes(id) : true;
 });

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.settings.categories['button-role-settings'];

 if (!settings) return [];

 return settings?.map((s) => ({
  name: `${lan.fields.msgid.name}: ${s.msgid ?? language.None}`,
  value: Number(s.uniquetimestamp).toString(36),
 }));
};

export default f;
