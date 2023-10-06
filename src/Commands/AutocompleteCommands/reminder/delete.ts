import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 const reminders = (
  await ch.DataBase.reminders.findMany({ where: { userid: cmd.user.id } })
 )?.filter((s) => {
  const id = String(cmd.options.get('id', false)?.value);

  return id ? Number(s.uniquetimestamp).toString(36).includes(id) : true;
 });

 if (!reminders) return [];

 return reminders?.map((r) => ({
  name: `${Number(r.uniquetimestamp).toString(36)} | ${r.reason.slice(0, 80)}`,
  value: Number(r.uniquetimestamp).toString(36),
 }));
};

export default f;
