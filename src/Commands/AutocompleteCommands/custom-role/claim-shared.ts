import * as CT from '../../../Typings/Typings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 if (!('user' in cmd)) return;

 const roleName = 'options' in cmd ? String(cmd.options.get('role', true)?.value) : undefined;

 const roles = await cmd.guild.client.util.DataBase.customroles
  .findMany({
   where: { guildid: cmd.guild.id },
  })
  .then((r) => r.filter((role) => role.shared.includes(cmd.user.id)));

 const typedRoles = roles.filter((r) =>
  cmd.guild.roles.cache
   .get(r.roleid)
   ?.name.toLowerCase()
   .includes(roleName?.toLowerCase() || ''),
 );

 return (typedRoles.length ? typedRoles : roles)
  .map((s) => ({
   name: cmd.guild.roles.cache.get(s.roleid)?.name || '-',
   value: `${s.roleid}-${s.userid}`,
  }))
  .slice(0, 25);
};

export default f;
