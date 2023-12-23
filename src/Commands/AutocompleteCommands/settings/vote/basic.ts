import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/Typings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 const settings = (
  await ch.DataBase.votesettings.findMany({ where: { guildid: cmd.guild.id } })
 ).filter((s) => {
  const id = 'options' in cmd ? String(cmd.options.get('id', false)?.value) : undefined;

  return id ? Number(s.uniquetimestamp).toString(36).includes(id) : true;
 });

 const language = await ch.getLanguage(cmd.guild.id);
 const lan = language.slashCommands.settings.categories.vote;

 if (!settings) return [];

 return settings?.map((s) => ({
  name: `${lan.fields.announcementchannel.name}: ${
   s.announcementchannel
    ? cmd.guild?.channels.cache.get(s.announcementchannel)?.name ?? language.t.None
    : language.t.None
  }`,
  value: Number(s.uniquetimestamp).toString(36),
 }));
};

export default f;
