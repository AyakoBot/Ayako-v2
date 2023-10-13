import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 const automodRules = cmd.guild?.autoModerationRules.cache
  .map((o) => o)
  ?.filter((r) => {
   const id = 'options' in cmd ? String(cmd.options.get('id', false)?.value) : undefined;

   return id ? r.id.includes(id) : true;
  });

 if (!automodRules) return [];

 const language = await ch.getLanguage(cmd.guild.id);

 return automodRules?.map((r) => ({
  name: `${r.name.slice(0, 100) ?? language.None}`,
  value: r.id,
 }));
};

export default f;
