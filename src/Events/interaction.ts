import * as Discord from 'discord.js';
import client from '../BaseClient/Client.js';
import Socket from '../BaseClient/Socket.js';
import * as Classes from '../BaseClient/Other/classes.js';
import interactionCreate from './interactionEvents/interactionCreate.js';
import * as ch from '../BaseClient/ClientHelper.js';

export default () => {
 Socket.on('interaction', async (rawInteraction: Discord.APIInteraction) => {
  if (!client.isReady()) return;

  if (rawInteraction.guild_id && !ch.cache.apis.get(rawInteraction.guild_id)) {
   const startOfToken = Buffer.from(rawInteraction.application_id)
    .toString('base64')
    .replace(/=+/g, '');

   const guildSettings = await ch.DataBase.guildsettings.findFirst({
    where: { token: { startsWith: startOfToken } },
   });
   if (!guildSettings) return;

   const api = ch.cache.apis.get(guildSettings?.guildid);
   if (!api) return;

   await api.interactions
    .reply(rawInteraction.id, rawInteraction.token, {
     embeds: [
      {
       color: ch.getColor(),
       description: `This Bot is a Custom-Instance of [**${client.user?.username}**](${ch.constants.standard.invite})\nPlease invite the original Bot into your Server instead of this one using [this Invite-URL](${ch.constants.standard.invite})\n\nI will now leave this Server`,
       author: {
        icon_url: client.user?.displayAvatarURL(),
        name: client.user?.username ?? 'Ayako',
        url: ch.constants.standard.invite,
       },
      },
     ],
     flags: 64,
    })
    .catch(() => undefined);

   api.rest.delete(`/users/@me/guilds/${rawInteraction.guild_id}`);
   return;
  }

  const parsedInteraction = getParsedInteraction(rawInteraction);
  if (!parsedInteraction) return;
  interactionCreate(parsedInteraction);
 });
};

const getParsedInteraction = (i: Discord.APIInteraction) => {
 if (!client.isReady()) return undefined;

 switch (i.type) {
  case Discord.InteractionType.ApplicationCommand: {
   switch (i.data.type) {
    case Discord.ApplicationCommandType.ChatInput: {
     return new Classes.ChatInputCommandInteraction(client, i);
    }
    case Discord.ApplicationCommandType.User: {
     return new Classes.UserContextMenuCommandInteraction(client, i);
    }
    case Discord.ApplicationCommandType.Message: {
     return new Classes.MessageContextMenuCommandInteraction(client, i);
    }
    default: {
     throw new Error('Unhandled Application Command Type');
    }
   }
  }
  case Discord.InteractionType.ApplicationCommandAutocomplete: {
   return new Classes.AutocompleteInteraction(client, i);
  }
  case Discord.InteractionType.MessageComponent: {
   switch (i.data.component_type) {
    case Discord.ComponentType.Button: {
     return new Classes.ButtonInteraction(client, i as never);
    }
    case Discord.ComponentType.ChannelSelect: {
     return new Classes.ChannelSelect(client, i as never);
    }
    case Discord.ComponentType.MentionableSelect: {
     return new Classes.MentionableSelect(client, i as never);
    }
    case Discord.ComponentType.RoleSelect: {
     return new Classes.RoleSelect(client, i as never);
    }
    case Discord.ComponentType.StringSelect: {
     return new Classes.StringSelect(client, i as never);
    }
    case Discord.ComponentType.UserSelect: {
     return new Classes.UserSelect(client, i as never);
    }
    default: {
     throw new Error('Unhandled Message Component Type');
    }
   }
  }
  case Discord.InteractionType.ModalSubmit: {
   return new Classes.ModalSubmit(client, i);
  }
  default: {
   throw new Error('Unhandled Interaction Type');
  }
 }
};
