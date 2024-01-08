import ChannelRules from '../../../../BaseClient/Other/ChannelRules.js';
import * as CT from '../../../../Typings/Typings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 const settings = (
  await cmd.guild.client.util.DataBase.levelingruleschannels.findMany({
   where: { guildid: cmd.guild.id },
  })
 )?.filter((s) => {
  const id = 'options' in cmd ? String(cmd.options.get('id', false)?.value) : undefined;

  return id ? Number(s.uniquetimestamp).toString(36).includes(id) : true;
 });

 const language = await cmd.guild.client.util.getLanguage(cmd.guild.id);

 if (!settings) return [];

 return settings?.map((s) => ({
  name: `${new ChannelRules(s).toArray().length} ${language.t.ChannelRules} - ${Number(
   s.channels?.length ?? 0,
  )} ${language.t.Channels}`,
  value: Number(s.uniquetimestamp).toString(36),
 }));
};

export default f;
