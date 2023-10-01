import * as Discord from 'discord.js';
import DataBase from '../DataBase.js';
import objectEmotes from './emotes.js';
import getLanguage from './getLanguage.js';
import constants from '../Other/constants.js';

/**
 * Sends an error message to the configured error channel of the guild.
 * @param guild - The guild where the error occurred.
 * @param err - The error object to be sent.
 * @returns Promise<void>
 */
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

 const language = await getLanguage(guild.id);

 channel.send({
  embeds: [
   {
    color: 0xff0000,
    description: `Stack Trace\n\`\`\`${err.stack?.replace(
     /file:\/\/\/root\/Bots\/Ayako-v1.6\/dist/g,
     '',
    )}\`\`\``,
    fields: [
     {
      name: 'Message',
      value: err.message,
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
