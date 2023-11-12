import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';
import client from '../../../../BaseClient/Client.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 const settings = (
  await ch.DataBase.voicehubs.findMany({ where: { guildid: cmd.guild.id } })
 )?.filter((s) => {
  const id = 'options' in cmd ? String(cmd.options.get('id', false)?.value) : undefined;

  return id ? Number(s.uniquetimestamp).toString(36).includes(id) : true;
 });

 const language = await ch.getLanguage(cmd.guild.id);
 const lan = language.slashCommands.settings.categories['voice-hubs'];

 if (!settings) return [];

 return settings?.map((s) => ({
  name: `${lan.fields.channelid.name}: ${
   s.channelid
    ? (client.channels.cache.get(s.channelid) as Discord.GuildTextBasedChannel)?.name ??
      language.None
    : language.None
  } - ${lan.fields.categoryid.name}: ${
   s.categoryid
    ? (client.channels.cache.get(s.categoryid) as Discord.CategoryChannel)?.name ?? language.None
    : language.None
  }`,
  value: Number(s.uniquetimestamp).toString(36),
 }));
};

export default f;
