import * as ch from '../../../../BaseClient/ClientHelper.js';
import ChannelRules from '../../../../BaseClient/Other/ChannelRules.js';
import * as CT from '../../../../Typings/CustomTypings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 const settings = (
  await ch.DataBase.levelingruleschannels.findMany({ where: { guildid: cmd.guildId } })
 )?.filter((s) => {
  const id = String(cmd.options.get('id', false)?.value);

  return id ? Number(s.uniquetimestamp).toString(36).includes(id) : true;
 });

 const language = await ch.getLanguage(cmd.guildId);

 if (!settings) return [];

 return settings?.map((s) => ({
  name: `${new ChannelRules(s).toArray().length} ${language.ChannelRules} - ${Number(
   s.channels?.length ?? 0,
  )} ${language.Channels}`,
  value: Number(s.uniquetimestamp).toString(36),
 }));
};

export default f;
