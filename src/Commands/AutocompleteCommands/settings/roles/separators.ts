import * as CT from '../../../../Typings/Typings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 if (!cmd.guild) return [];

 const settings = (
  await cmd.guild.client.util.DataBase.roleseparator.findMany({ where: { guildid: cmd.guild.id } })
 )?.filter((s) => {
  const id = 'options' in cmd ? String(cmd.options.get('id', false)?.value) : undefined;

  return id ? Number(s.uniquetimestamp).toString(36).includes(id) : true;
 });

 if (!settings) return [];

 const language = await cmd.guild.client.util.getLanguage(cmd.guild.id);

 return settings?.map((s) => ({
  name: `ID: ${Number(s.uniquetimestamp).toString(36)} - ${language.t.Role}: ${
   s.separator
    ? cmd.guild!.roles.cache.get(s.separator)?.name.replace(/\W/g, '').trim().slice(0, 20)
    : language.t.None
  }`,
  value: Number(s.uniquetimestamp).toString(36),
 }));
};

export default f;
