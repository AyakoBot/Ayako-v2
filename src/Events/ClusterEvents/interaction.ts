import * as Discord from 'discord.js';
import client from '../../BaseClient/Bot/Client.js';
import * as Classes from '../../BaseClient/Other/classes.js';
import interactionCreate from '../BotEvents/interactionEvents/interactionCreate.js';
import * as Typings from '../../Typings/Typings.js';

export default async (message: Typings.InteractionMessage) => {
 const { interaction } = message;
 if (client.cluster?.maintenance) return;

 if (interaction.guild_id && !client.util.cache.apis.get(interaction.guild_id)) {
  const startOfToken = Buffer.from(interaction.application_id)
   .toString('base64')
   .replace(/=+/g, '');

  const guildSettings = await client.util.DataBase.guildsettings.findFirst({
   where: { token: { startsWith: startOfToken } },
  });
  if (!guildSettings) return;

  const api = client.util.cache.apis.get(guildSettings?.guildid);
  if (!api) return;

  await api.interactions
   .reply(interaction.id, interaction.token, {
    embeds: [
     {
      color: client.util.getColor(),
      description: `This Bot is a Custom-Instance of [**${client.user?.username}**](${client.util.constants.standard.invite})
Please invite the original Bot into your Server, instead of this one, using [this Invite-URL](${client.util.constants.standard.invite})

I will now leave this Server`,
      author: {
       icon_url: client.user?.displayAvatarURL(),
       name: client.user?.username ?? 'Ayako',
       url: client.util.constants.standard.invite,
      },
     },
    ],
    flags: 64,
   })
   .catch(() => undefined);

  api.rest.delete(`/users/@me/guilds/${interaction.guild_id}`);
  return;
 }

 const parsedInteraction = getParsedInteraction(interaction);
 if (!parsedInteraction) return;
 interactionCreate(parsedInteraction);
};

const getParsedInteraction = (i: Discord.APIInteraction) => {
 if (!client.isReady()) return undefined;

 switch (i.type) {
  case Discord.InteractionType.ApplicationCommand: {
   switch (i.data.type) {
    case Discord.ApplicationCommandType.ChatInput:
     return new Classes.ChatInputCommandInteraction(client, i);
    case Discord.ApplicationCommandType.User:
     return new Classes.UserContextMenuCommandInteraction(client, i);
    case Discord.ApplicationCommandType.Message:
     return new Classes.MessageContextMenuCommandInteraction(client, i);
    default:
     throw new Error('Unhandled Application Command Type');
   }
  }
  case Discord.InteractionType.ApplicationCommandAutocomplete: {
   return new Classes.AutocompleteInteraction(client, i);
  }
  case Discord.InteractionType.MessageComponent: {
   switch (i.data.component_type) {
    case Discord.ComponentType.Button:
     return new Classes.ButtonInteraction(client, i as never);
    case Discord.ComponentType.ChannelSelect:
     return new Classes.ChannelSelect(client, i as never);
    case Discord.ComponentType.MentionableSelect:
     return new Classes.MentionableSelect(client, i as never);
    case Discord.ComponentType.RoleSelect:
     return new Classes.RoleSelect(client, i as never);
    case Discord.ComponentType.StringSelect:
     return new Classes.StringSelect(client, i as never);
    case Discord.ComponentType.UserSelect:
     return new Classes.UserSelect(client, i as never);
    default:
     throw new Error('Unhandled Message Component Type');
   }
  }
  case Discord.InteractionType.ModalSubmit:
   return new Classes.ModalSubmit(client, i);
  default:
   throw new Error(`Unhandled Interaction Type ${i.type} ${Discord.ComponentType[i.type]}`);
 }
};
