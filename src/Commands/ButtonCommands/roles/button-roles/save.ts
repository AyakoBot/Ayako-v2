import Prisma from '@prisma/client';
import * as Discord from 'discord.js';
import { findField } from '../../../SelectCommands/StringSelect/roles/button-roles.js';
import {
 type Type,
 getBaseSettings,
 getSpecificSettings,
} from '../../../SlashCommands/roles/builders/button-roles.js';
import refresh from './refresh.js';

export default async (
 cmd: Discord.ButtonInteraction,
 args: string[],
 type: Type = 'button-roles',
) => {
 if (!cmd.inCachedGuild()) return;

 const emoji = args.join('_');
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const message = (await cmd.client.util.getMessage(
  cmd.message.embeds[0].url as string,
 )) as Discord.Message<true>;

 if (!message || message.guildId !== cmd.guildId) {
  cmd.client.util.errorCmd(cmd, language.errors.messageNotFound, language);
  return;
 }

 const baseSettings =
  (await getBaseSettings(type, cmd.guildId, message.id)) ??
  (type === 'reaction-roles'
   ? await cmd.client.util.DataBase.reactionrolesettings.create({
      data: {
       uniquetimestamp: Date.now(),
       active: true,
       guildid: cmd.guildId,
       msgid: message.id,
       channelid: message.channelId,
      },
     })
   : await cmd.client.util.DataBase.buttonrolesettings.create({
      data: {
       uniquetimestamp: Date.now(),
       active: true,
       onlyone: false,
       guildid: cmd.guildId,
       msgid: message.id,
       channelid: message.channelId,
      },
     }));

 if (!baseSettings) {
  cmd.client.util.error(cmd.guild, new Error('Failed to create settings'));
  return;
 }

 const settings = await getSpecificSettings(type, cmd.guildId, baseSettings.uniquetimestamp, emoji);
 const field = findField(
  Discord.parseEmoji(emoji) as Discord.PartialEmoji,
  cmd.message.embeds[0].fields,
 );
 const roles = field?.value.split(/,\s+/g).map((r) => r.replace(/\D+/g, '')) ?? [];

 if (settings.length) {
  if (type === 'reaction-roles') {
   await cmd.client.util.DataBase.reactionroles.updateMany({
    where: {
     linkedid: baseSettings.uniquetimestamp.toString(),
     emote: emoji,
    },
    data: {
     active: true,
     roles,
    },
   });
  } else {
   await cmd.client.util.DataBase.buttonroles.updateMany({
    where: {
     linkedid: baseSettings.uniquetimestamp.toString(),
     emote: emoji,
    },
    data: {
     active: true,
     roles,
    },
   });
  }
 } else if (type === 'reaction-roles') {
  await cmd.client.util.DataBase.reactionroles.create({
   data: {
    uniquetimestamp: Date.now(),
    guildid: cmd.guildId,
    active: true,
    emote: emoji,
    roles,
    linkedid: baseSettings.uniquetimestamp.toString(),
   },
  });
 } else {
  await cmd.client.util.DataBase.buttonroles.create({
   data: {
    uniquetimestamp: Date.now(),
    guildid: cmd.guildId,
    active: true,
    emote: emoji,
    roles,
    linkedid: baseSettings.uniquetimestamp.toString(),
   },
  });
 }

 const allSettings =
  type === 'reaction-roles'
   ? await cmd.client.util.DataBase.reactionroles.findMany({
      where: {
       linkedid: baseSettings.uniquetimestamp.toString(),
      },
     })
   : await cmd.client.util.DataBase.buttonroles.findMany({
      where: {
       linkedid: baseSettings.uniquetimestamp.toString(),
      },
     });

 const action =
  type === 'button-roles'
   ? await putComponents(allSettings as Prisma.buttonroles[], message)
   : await putReactions(allSettings as Prisma.reactionroles[], message);

 if (type === 'button-roles') {
  const emote = emoji ? Discord.parseEmoji(emoji) : undefined;

  const reaction = message.reactions.cache.get(emote?.id ?? emote?.name ?? '');
  if (reaction) {
   await cmd.client.util.request.channels.deleteAllReactionsOfEmoji(
    message,
    reaction.emoji.identifier,
   );
  }
 }

 const lan = language.slashCommands.roles.builders;

 if (action && 'message' in action && typeof action.message === 'string') {
  cmd.client.util.errorCmd(cmd, lan.couldntReact, language);
  return;
 }

 refresh(cmd, [], type);
};

export const putComponents = async (
 allSettings: Prisma.buttonroles[] | undefined,
 message: Discord.Message<true>,
) => {
 const chunks = allSettings
  ? message.client.util.getChunks(
     allSettings.map((s): Discord.APIButtonComponentWithCustomId => {
      const emote = s.emote ? Discord.parseEmoji(s.emote) : undefined;

      return {
       label: s.text || undefined,
       emoji: {
        id: emote?.id,
        name: emote?.name ?? emote?.id ?? undefined,
        animated: emote?.animated,
       },
       custom_id: `roles/button-roles/takeRole_${s.uniquetimestamp}`,
       style: Discord.ButtonStyle.Secondary,
       type: Discord.ComponentType.Button,
      };
     }),
     5,
    )
  : [];

 const action = await message.client.util.request.channels.editMsg(message, {
  components: chunks.map((c) => ({
   type: Discord.ComponentType.ActionRow,
   components: c,
  })),
 });

 return action;
};

const putReactions = async (
 allSettings: Prisma.reactionroles[] | undefined,
 message: Discord.Message<true>,
) => {
 if (!allSettings) return message.client.util.request.channels.deleteAllReactions(message);

 const firstSetting = allSettings.find((s) => {
  const emote = s.emote ? Discord.parseEmoji(s.emote) : undefined;

  return !message.reactions.cache.get(emote?.id ?? emote?.name ?? '')?.me;
 });

 const emote = firstSetting?.emote ? Discord.parseEmoji(firstSetting.emote) : undefined;
 const reaction = message.reactions.cache.get(emote?.name ?? emote?.id ?? '');
 const action = reaction
  ? await message.client.util.request.channels.addReaction(message, reaction.emoji.identifier)
  : undefined;
 if (action && 'message' in action && typeof action.message === 'string') return action;

 allSettings.forEach((s) => {
  const emoji = s.emote ? Discord.parseEmoji(s.emote) : undefined;
  if (!emoji || !('name' in emoji)) return;

  message.client.util.request.channels.addReaction(
   message,
   emoji.id
    ? `${'animated' in emoji && emoji.animated ? 'a:' : ''}${emoji.name}:${emoji.id}`
    : (emoji.name as string),
  );
 });

 return message;
};
