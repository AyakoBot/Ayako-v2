import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 const settings = (
  await ch.DataBase.reactionrolesettings.findMany({ where: { guildid: cmd.guildId } })
 )?.filter((s) => {
  const id = cmd.isAutocomplete() ? String(cmd.options.get('id', false)?.value) : '';

  return id ? Number(s.uniquetimestamp).toString(36).includes(id) : true;
 });

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.settings.categories['reaction-role-settings'];

 if (!settings) return [];

 return settings?.map((s) => ({
  name: `${lan.fields.messagelink.name}: ${
   s.guildid && s.channelid && s.msgid
    ? ch.constants.standard.msgurl(s.guildid, s.channelid, s.msgid)
    : language.None
  }`,
  value: Number(s.uniquetimestamp).toString(36),
 }));
};

export default f;
