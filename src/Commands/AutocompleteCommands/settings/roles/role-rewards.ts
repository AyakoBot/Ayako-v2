import * as CT from '../../../../Typings/Typings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 if (!cmd.guild) return [];

 const settings = (
  await cmd.guild.client.util.DataBase.rolerewards.findMany({ where: { guildid: cmd.guild.id } })
 )?.filter((s) => {
  const id = 'options' in cmd ? String(cmd.options.get('id', false)?.value) : undefined;

  return id ? Number(s.uniquetimestamp).toString(36).includes(id) : true;
 });

 const language = await cmd.guild.client.util.getLanguage(cmd.guild.id);
 const lan = language.slashCommands.settings.categories['role-rewards'];

 if (!settings) return [];

 return settings?.map((s) => ({
  name: `${lan.fields.roles.name}: \`${s.roles?.length ?? language.t.None}\``,
  value: Number(s.uniquetimestamp).toString(36),
 }));
};

export default f;
