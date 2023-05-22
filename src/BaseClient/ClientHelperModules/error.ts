import * as Discord from 'discord.js';
import query from './query.js';
import * as getChannel from './getChannel.js';
import * as DBT from '../../Typings/DataBaseTypings';
import objectEmotes from './objectEmotes.js';

export default async (guild: Discord.Guild, err: Error) => {
 const errorchannel = await query(`SELECT errorchannel FROM guildsettings WHERE guildid = $1;`, [
  guild.id,
 ]).then((r: DBT.guildsettings[] | null) => r?.[0].errorchannel);
 if (!errorchannel) return;

 const channel = await getChannel.guildTextChannel(errorchannel);
 if (!channel) return;

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
    title: 'Error',
    thumbnail: {
     url: objectEmotes.warning.link,
    },
   },
  ],
 });
};
