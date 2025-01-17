import * as Discord from 'discord.js';
import client from '../../BaseClient/Bot/Client.js';
import * as Classes from '../../BaseClient/Other/classes.js';
import requestHandler from '../../BaseClient/UtilModules/requestHandler.js';
import * as Typings from '../../Typings/Typings.js';
import interactionCreate from '../BotEvents/interactionEvents/interactionCreate.js';

export default async (message: Typings.Message<Typings.MessageType.Interaction>) => {
 const interaction = message.data;
 if (client.cluster?.maintenance) return;
 if (process.argv.includes('--dev')) return;

 const api = interaction.guild_id
  ? await getAPI(interaction as Parameters<typeof getAPI>[0])
  : null;

 if (interaction.guild_id && !api) {
  wrongServer(interaction);
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
  case Discord.InteractionType.ApplicationCommandAutocomplete:
   return new Classes.AutocompleteInteraction(client, i);
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

const getAPI = async (msg: Discord.APIInteraction & { guild_id: string }) => {
 if (client.util.cache.apis.get(msg.guild_id)) {
  return client.util.cache.apis.get(msg.guild_id) || null;
 }

 const startOfToken = Buffer.from(msg.application_id).toString('base64').replace(/=+/g, '');

 const guildSettings = await client.util.DataBase.customclients.findFirst({
  where: { token: { startsWith: startOfToken } },
 });
 if (!guildSettings) return null;

 await requestHandler(msg.guild_id, guildSettings.token!);
 return client.util.cache.apis.get(msg.guild_id) || null;
};

const wrongServer = async (msg: Discord.APIInteraction) => {
 const settings = await client.util.DataBase.customclients.findFirst({
  where: { appid: msg.application_id, token: { not: null } },
 });
 if (!settings) return;

 const api = await getAPI({ ...msg, guild_id: settings.guildid });
 if (!api) return;

 await api.interactions
  .reply(msg.id, msg.token, {
   embeds: [
    {
     color: client.util.getColor(),
     description: `This Bot is a Custom-Instance of [**${client.user?.username}**](${client.util.constants.standard.invite})
Please invite the original Bot into your Server, instead of this one, using [this Invite-URL](${client.util.constants.standard.invite})
`,
     author: {
      icon_url: client.user?.displayAvatarURL(),
      name: client.user?.username ?? 'Ayako',
      url: client.util.constants.standard.invite,
     },
    },
   ],
   flags: Discord.MessageFlags.Ephemeral,
  })
  .catch(() => undefined);
};
