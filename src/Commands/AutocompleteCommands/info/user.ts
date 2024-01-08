import * as CT from '../../../Typings/Typings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 if (!('options' in cmd)) return [];

 const value = cmd.options.get('user-name', false)?.value as string;
 if (value?.length < 3) return [];

 const possibleUsers = await cmd.guild.client.util.findUserByName(value);

 return [...new Set(possibleUsers.map((u) => u.id))]
  .map((id) => ({
   name: possibleUsers.find((u) => u.id === id)?.username ?? '-',
   value: id,
  }))
  .splice(0, 25);
};

export default f;
