import * as Discord from 'discord.js';
import client from '../BaseClient/Client.js';
import Socket from '../BaseClient/Socket.js';
import * as Classes from '../BaseClient/Other/classes.js';
import interactionCreate from './interactionEvents/interactionCreate.js';
import * as ch from '../BaseClient/ClientHelper.js';

export default () => {
 Socket.on('interaction', async (rawInteraction: Discord.APIInteraction) => {
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

   api.rest.delete(`/users/@me/guilds/${rawInteraction.guild_id}`);
   return;
  }

  interactionCreate(getParsedInteraction(rawInteraction));
 });
};

const getParsedInteraction = (i: Discord.APIInteraction) => {
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
