import * as Discord from 'discord.js';
import DataBase from '../DataBase.js';
import objectEmotes from './objectEmotes.js';
import languageSelector from './languageSelector.js';
import constants from '../Other/constants.js';

export default async (guild: Discord.Guild, err: Error) => {
 const errorchannel = await DataBase.guildsettings
  .findUnique({
   where: { guildid: guild.id },
   select: { errorchannel: true },
  })
  .then((r) => r?.errorchannel);
 if (!errorchannel) return;

 const { guildTextChannel } = await import('./getChannel.js');
 const channel = await guildTextChannel(errorchannel);
 if (!channel) return;

 const language = await languageSelector(guild.id);

 channel.send({
  embeds: [
   {
    color: 0xff0000,
    description: err.message,
    fields: [
     {
      name: 'Stack Trace',
      value: `\`\`\`${err.stack?.replace(/file:\/\/\/root\/Bots\/Ayako-v1.6\/dist/g, '')}\`\`\``,
     },
    ],
    author: {
     name: 'Error',
     icon_url: objectEmotes.warning.link,
    },
    title: language.errors.contactSupport,
    url: constants.standard.support,
   },
  ],
 });
};
