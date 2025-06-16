import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';

const f: CT.AutoCompleteFile['default'] = async (cmd) => {
 if (!cmd.guild) return [];
 const settings = (
  await cmd.guild.client.util.DataBase.voicehubs.findMany({ where: { guildid: cmd.guild.id } })
 )?.filter((s) => {
  const id = 'options' in cmd ? String(cmd.options.get('id', false)?.value) : undefined;

  return id ? Number(s.uniquetimestamp).toString(36).includes(id) : true;
 });

 const language = await cmd.guild.client.util.getLanguage(cmd.guild.id);
 const lan = language.slashCommands.settings.categories['voice-hubs'];

 if (!settings) return [];

 return settings?.map((s) => ({
  name: `${lan.fields.channelid.name}: ${
   s.channelid
    ? ((client.channels.cache.get(s.channelid) as Discord.GuildTextBasedChannel)?.name ??
      language.t.None)
    : language.t.None
  } - ${lan.fields.categoryid.name}: ${
   s.categoryid
    ? ((client.channels.cache.get(s.categoryid) as Discord.CategoryChannel)?.name ??
      language.t.None)
    : language.t.None
  }`,
  value: Number(s.uniquetimestamp).toString(36),
 }));
};

export default f;
