import * as ch from '../../../../BaseClient/ClientHelper.js';
import type * as CT from '../../../../Typings/CustomTypings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 const settings = (
  await ch.query(
   `SELECT * FROM ${ch.constants.commands.settings.tableNames['button-roles']} WHERE guildid = $1;`,
   [cmd.guildId],
   { returnType: 'buttonroles', asArray: true },
  )
 )?.filter((s) => {
  const id = cmd.isAutocomplete() ? String(cmd.options.get('id', false)?.value) : '';

  return id ? Number(s.uniquetimestamp).toString(36).includes(id) : true;
 });

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.settings.categories['button-roles'];

 if (!settings) return [];

 return settings?.map((s) => ({
  name: `${lan.fields.linkedid.name}: ${Number(s.linkedid).toString(36)} - ${
   lan.fields.text.name
  }/${lan.fields.emote.name}: ${s.text ?? language.None}/${[1]
   .map(() => {
    if (s.emote.match(ch.regexes.emojiTester)?.length) return s.emote;
    if (s.emote) return s.emote.split(/:/g)[1];
    return language.None;
   })
   .join('')}`,
  value: Number(s.uniquetimestamp).toString(36),
 }));
};

export default f;
