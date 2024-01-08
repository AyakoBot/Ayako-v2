import * as CT from '../../../Typings/Typings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 if (!('user' in cmd)) return [];

 const reminders = (
  await cmd.guild.client.util.DataBase.reminders.findMany({ where: { userid: cmd.user.id } })
 )?.filter((s) => {
  const id = 'options' in cmd ? String(cmd.options.get('id', false)?.value) : undefined;

  return id ? Number(s.uniquetimestamp).toString(36).includes(id) : true;
 });

 if (!reminders) return [];

 return reminders?.map((r) => ({
  name: `${Number(r.uniquetimestamp).toString(36)} | ${r.reason.slice(0, 80)}`,
  value: Number(r.uniquetimestamp).toString(36),
 }));
};

export default f;
