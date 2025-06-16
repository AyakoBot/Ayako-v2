import * as CT from '../../../Typings/Typings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 if (!cmd.guild) return [];
 if (!('user' in cmd)) return [];

 const reminders = (
  await cmd.guild.client.util.DataBase.reminder.findMany({ where: { userId: cmd.user.id } })
 )?.filter((s) => {
  const id = 'options' in cmd ? String(cmd.options.get('id', false)?.value) : undefined;

  return id ? Number(s.startTime).toString(36).includes(id) : true;
 });

 if (!reminders) return [];

 return reminders?.map((r) => ({
  name: `${Number(r.startTime).toString(36)} | ${r.reason.slice(0, 80)}`,
  value: Number(r.startTime).toString(36),
 }));
};

export default f;
