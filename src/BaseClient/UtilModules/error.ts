import * as Discord from 'discord.js';
import DataBase from '../Bot/DataBase.js';
import type * as CT from '../../Typings/Typings.js';

/**
 * Sends an error message to the configured error channel of the guild.
 * @param guild - The guild where the error occurred.
 * @param err - The error object to be sent.
 * @returns Promise<void>
 */
export default async (guild: Discord.Guild, err: Error, postDebug: boolean = true) => {
 if (process.argv.includes('--silent')) return;

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

 const language = await guild.client.util.getLanguage(guild.id);

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
     icon_url: guild.client.util.emotes.warning.link,
    },
    title: language.errors.contactSupport,
    url: guild.client.util.constants.standard.support,
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
      url: guild.client.util.constants.standard.support,
     },
    ],
   },
  ],
 };

 if (postDebug) sendDebugMessage(payload, guild.client);
 if (!guild.members.me) return;
 if (
  !guild.client.util.importCache.BaseClient.UtilModules.requestHandler.channels.sendMessage.file.canSendMessage(
   channel.id,
   payload,
   guild.members.me,
  )
 ) {
  return;
 }
 guild.client.util.request.channels.sendMessage(undefined, channel.id, payload, guild.client);
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
