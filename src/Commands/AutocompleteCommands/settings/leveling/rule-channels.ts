import * as ch from '../../../../BaseClient/ClientHelper.js';
import ChannelRules from '../../../../BaseClient/Other/ChannelRules.js';
import type * as CT from '../../../../Typings/CustomTypings';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 const settings = (
  await ch.query(
   `SELECT * FROM ${ch.constants.commands.settings.tableNames['rule-channels']} WHERE guildid = $1;`,
   [cmd.guildId],
   { returnType: 'levelingruleschannels', asArray: true },
  )
 )?.filter((s) => {
  const id = cmd.isAutocomplete() ? String(cmd.options.get('id', false)?.value) : '';

  return id ? Number(s.uniquetimestamp).toString(36).includes(id) : true;
 });

 const language = await ch.languageSelector(cmd.guildId);

 if (!settings) return [];

 return settings?.map((s) => ({
  name: `${new ChannelRules(s).toArray().length} ${language.ChannelRules} - ${Number(
   s.channels?.length ?? 0,
  )} ${language.Channels}`,
  value: Number(s.uniquetimestamp).toString(36),
 }));
};

export default f;
