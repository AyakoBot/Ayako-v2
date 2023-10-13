import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';

const f: CT.AutoCompleteFile['default'] = async (
 cmd: Discord.AutocompleteInteraction<'cached'> | { guildId: string },
) => {
 const settings = (
  await ch.DataBase.reactionrolesettings.findMany({ where: { guildid: cmd.guildId } })
 )?.filter((s) => {
  const id = 'options' in cmd ? String(cmd.options.get('id', false)?.value) : null;

  return id ? Number(s.uniquetimestamp).toString(36).includes(id) : true;
 });

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.settings.categories['reaction-role-settings'];

 if (!settings) return [];

 return settings?.map((s) => ({
  name: `${lan.fields.msgid.name}: ${s.msgid ?? language.None}`,
  value: Number(s.uniquetimestamp).toString(36),
 }));
};

export default f;
