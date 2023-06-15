import * as Discord from 'discord.js';
import query from './query.js';
import * as getChannel from './getChannel.js';
import objectEmotes from './objectEmotes.js';
import languageSelector from './languageSelector.js';
import constants from '../Other/constants.js';

export default async (guild: Discord.Guild, err: Error) => {
 const errorchannel = await query(
  `SELECT errorchannel FROM guildsettings WHERE guildid = $1;`,
  [guild.id],
  { returnType: 'guildsettings', asArray: false },
 ).then((r) => r?.errorchannel);
 if (!errorchannel) return;

 const channel = await getChannel.guildTextChannel(errorchannel);
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
    },
    title: language.errors.contactSupport,
    url: constants.standard.support,
    thumbnail: {
     url: objectEmotes.warning.link,
    },
   },
  ],
 });
};
