import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/Typings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 const settings = (
  await ch.DataBase.reactionrolesettings.findMany({ where: { guildid: cmd.guild.id } })
 )?.filter((s) => {
  const id = 'options' in cmd ? String(cmd.options.get('id', false)?.value) : null;

  return id ? Number(s.uniquetimestamp).toString(36).includes(id) : true;
 });

 const language = await ch.getLanguage(cmd.guild.id);
 const lan = language.slashCommands.settings.categories['reaction-role-settings'];

 if (!settings) return [];

 return settings?.map((s) => ({
  name: `${lan.fields.msgid.name}: ${s.msgid ?? language.t.None} | ID: ${Number(
   s.uniquetimestamp,
  ).toString(36)}`,
  value: Number(s.uniquetimestamp).toString(36),
 }));
};

export default f;
