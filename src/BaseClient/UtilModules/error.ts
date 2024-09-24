import * as Discord from 'discord.js';
import * as CT from '../../Typings/Typings.js';
import DataBase from '../Bot/DataBase.js';
import constants from '../Other/constants.js';
import objectEmotes from './emotes.js';
import { getLanguage } from './getLanguage.js';
import { request } from './requestHandler.js';
import { canSendMessage } from './requestHandler/channels/sendMessage.js';

/**
 * Sends an error message to the configured error channel of the guild.
 * @param guild - The guild where the error occurred.
 * @param err - The error object to be sent.
 * @returns Promise<void>
 */
export default async (
 guild: Discord.Guild | undefined | null,
 err: Error | Discord.DiscordAPIError,
 postDebug: boolean = true,
) => {
 if (process.argv.includes('--silent')) return;
 if (!guild && !postDebug) return;
 if (!(err instanceof Discord.DiscordAPIError)) postDebug = false;

 const language = await getLanguage(guild?.id ?? 'en-GB');

 const filteredStack = err.stack
  ?.replace(/file:\/\/\/root\/Ayako\/packages\/Bot/g, '')
  .split(/\n+/g)
  .filter((l) => !l.includes('node_modules') && !l.includes('node:internal'));

 const payload: Omit<CT.UsualMessagePayload, 'files'> = {
  embeds: [
   {
    footer: {
     text: `Filtered stacktrace size: ${filteredStack?.length ?? 0}`,
    },
    color: 0xff0000,
    description: `Stack Trace\n\`\`\`${Number(filteredStack?.length) < 3 ? err.stack : filteredStack?.join('\n')}\`\`\``,
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

 if (postDebug) sendDebugMessage(payload);
 if (!guild) return;
 if (!proceed(err.message, err.stack)) return;

 const errorchannel = await DataBase.guildsettings
  .findUnique({
   where: { guildid: guild.id },
   select: { errorchannel: true },
  })
  .then((r) => r?.errorchannel);
 if (!errorchannel) return;

 const channel = await guild.client.util.getChannel.guildTextChannel(errorchannel);
 if (!channel) return;

 if (!guild.members.me) return;
 if (!canSendMessage(channel.id, payload, guild.members.me)) return;
 request.channels.sendMessage(undefined, channel.id, payload, guild.client);
};

export const sendDebugMessage = async (payload: CT.UsualMessagePayload) => {
 const client = await import('../Bot/Client.js').then((c) => c.default);

 client.util.request.webhooks.execute(
  undefined,
  process.env.debugWebhookId ?? '',
  process.env.debugWebhookToken ?? '',
  payload,
  client as Discord.Client<true>,
 );
};

const proceed = (message: string, stack: string | undefined) => {
 switch (true) {
  case message.includes('Connect Timeout Error'):
  case message.includes('other side closed'):
  case message.includes('write EPIPE'):
  case message.includes('No Description'):
  case message.includes('Unknown Message'):
  case message.includes('Unknown Member'):
  case message.includes('Unknown Channel'):
  case message.includes('Cannot send messages to this user'):
  case stack?.includes('ptReminder.ts'):
   return false;

  default:
   return true;
 }
};
