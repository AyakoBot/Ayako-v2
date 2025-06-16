import * as CT from '../../../../Typings/Typings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 if (!cmd.guild) return [];
 if (!('options' in cmd)) return [];

 const value = cmd.options.get('embed', true).value as string | null;
 const embeds = await cmd.guild.client.util.DataBase.customembeds.findMany({
  where: { guildid: cmd.guild.id },
 });

 return embeds
  ?.filter((e) => (value ? e.name.includes(value) : true))
  .map((e) => ({
   name: e.name,
   value: e.uniquetimestamp.toString(),
  }));
};

export default f;
