import * as Discord from 'discord.js';
import DataBase from '../Bot/DataBase.js';
import objectEmotes from './emotes.js';
import getLanguage from './getLanguage.js';
import constants from '../Other/constants.js';
import * as CT from '../../Typings/Typings.js';
import { request } from './requestHandler.js';
import { canSendMessage } from './requestHandler/channels/sendMessage.js';

/**
 * Sends an error message to the configured error channel of the guild.
 * @param guild - The guild where the error occurred.
 * @param err - The error object to be sent.
 * @returns Promise<void>
 */
export default async (guild: Discord.Guild, err: Error, postDebug: boolean = true) => {
 if (process.argv.includes('--silent')) return;
 if (!proceed(err.message)) return;

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

 const payload: Omit<CT.UsualMessagePayload, 'files'> = {
  embeds: [
   {
    color: 0xff0000,
    description: `Stack Trace\n\`\`\`${err.stack?.replace(
     /file:\/\/\/root\/Bots\/Ayako-v2\/dist/g,
     '',
    )}\`\`\``,
    fields: [
     {
      name: 'Message',
      value: err.message.split(/:+/g).slice(1, 100).join(':'),
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
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Link,
      label: language.slashCommands.help.clickMe,
      url: constants.standard.support,
     },
    ],
   },
  ],
 };

 if (postDebug) sendDebugMessage(payload, guild.client);
 if (!guild.members.me) return;
 if (!canSendMessage(channel.id, payload, guild.members.me)) return;
 request.channels.sendMessage(undefined, channel.id, payload, guild.client);
};

export const sendDebugMessage = async (
 payload: CT.UsualMessagePayload,
 client: Discord.Client<true>,
) => {
 const webhook = await client.fetchWebhook(
  process.env.debugWebhookID ?? '',
  process.env.debugWebhookToken ?? '',
 );

 webhook.send(payload);
};

const proceed = (message: string) => {
 switch (true) {
  case message.includes('Connect Timeout Error'):
  case message.includes('other side closed'):
  case message.includes('write EPIPE'):
  case message.includes('No Description'):
  case message.includes('Unknown Message'):
  case message.includes('Unknown Member'):
  case message.includes('Unknown Channel'):
   return false;

  default:
   return true;
 }
};
