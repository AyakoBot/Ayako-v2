import * as CT from '../../../Typings/Typings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 if (!('options' in cmd)) return [];

 const value = cmd.options.get('server-name', false)?.value as string;
 if (value?.length < 3) return [];

 const possibleServers = await cmd.guild.client.util.findServerByName(value);

 return [...new Set(possibleServers.map((u) => u.id))]
  .map((id) => ({
   name: possibleServers.find((u) => u.id === id)?.name ?? '-',
   value: id,
  }))
  .splice(0, 25);
};

export default f;
