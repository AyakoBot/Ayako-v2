import { Prisma } from '@prisma/client';
import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';

export type Type = 'button-roles' | 'reaction-roles';

export default async (
 cmd: Discord.ChatInputCommandInteraction | Discord.ButtonInteraction,
 _: [],
 reply?: Discord.InteractionResponse<true>,
 type: Type = 'button-roles',
) => {
 if (!cmd.inCachedGuild()) return;
 if (!reply) reply = await cmd.deferReply({ ephemeral: true });

 const language = await client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.roles.builders;

 const message = await client.util.getMessage(
  cmd.isChatInputCommand()
   ? cmd.options.getString('message', true)
   : (cmd.message.embeds[0].url as string),
 );
 if (!message || message.guildId !== cmd.guildId) {
  client.util.errorCmd(cmd, language.errors.messageNotFound, language, reply);
  return;
 }

 if (message.author.id !== (await cmd.client.util.getBotIdFromGuild(cmd.guild))) {
  client.util.errorCmd(
   cmd,
   lan.messageNotFromMe(
    (await client.util.getCustomCommand(cmd.guild, 'embed-builder'))?.id ?? '0',
   ),
   language,
   reply,
  );
  return;
 }

 const baseSettings =
  (await getBaseSettings(type, cmd.guildId, message.id)) ??
  (await createBaseSettings(type, cmd.guildId, message.channelId, message.id));
 if (!baseSettings) {
  client.util.errorCmd(cmd, language.errors.settingNotFound, language, reply);
  return;
 }

 const settings = await getSpecificSettings(type, cmd.guildId, baseSettings.uniquetimestamp);

 await Promise.all(
  message.reactions.cache.map((r) =>
   client.util.request.channels.getReactions(
    message as Discord.Message<true>,
    r.emoji.id ?? r.emoji.name ?? '',
    {
     limit: 1,
    },
   ),
  ),
 );

 const applyReactions = message.reactions.cache.filter(
  (r) =>
   r.count === 1 &&
   r.users.cache.has(cmd.user.id) &&
   !settings?.find(
    (s) => s.emote === (!r.emoji.id ? (r.emoji.name as string) : r.emoji.identifier),
   ),
 );

 const options: Discord.SelectMenuComponentOptionData[] = [
  ...((settings?.map((s) => ({
   emoji: {
    name: s.emote?.includes(':') ? '_' : s.emote,
    id: s.emote?.includes(':') ? s.emote.split(/:/g).at(-1) : undefined,
    animated: s.emote?.startsWith('a:'),
   },
   label: language.t.Edit,
   value: s.emote ?? s.uniquetimestamp,
  })) ?? []) as Discord.SelectMenuComponentOptionData[]),
  ...applyReactions.map((r) => ({
   emoji: {
    id: r.emoji.id || undefined,
    name: r.emoji.name || undefined,
    animated: r.emoji.animated || undefined,
   },
   label: language.t.Add,
   value: !r.emoji.id ? (r.emoji.name as string) : r.emoji.identifier,
  })),
 ].slice(0, 25);

 const payload = {
  embeds: [
   {
    description: `${
     type === 'button-roles'
      ? lan.descButtons((await client.util.getCustomCommand(cmd.guild, 'settings'))?.id ?? '0')
      : lan.descReactions((await client.util.getCustomCommand(cmd.guild, 'settings'))?.id ?? '0')
    }\n\n${lan.buttons}`,
    url: message.url,
    fields: settings
     ?.filter((s) => !!s.emote)
     .map((s) => ({
      name: `${
       !Discord.parseEmoji(s.emote as string)?.id
        ? s.emote
        : `<${s.emote?.startsWith('a:') ? '' : ':'}${s.emote}>`
      } / ${client.util.util.makeInlineCode(s.emote as string)}`,
      value: s?.roles?.map((r) => `<@&${r}>`).join(', ') ?? language.t.None,
     })),
   },
  ],
  components: getComponents(options, lan, message, type),
 };

 if (cmd.isChatInputCommand()) cmd.editReply(payload as Discord.InteractionEditReplyOptions);
 else {
  if (reply) reply.delete();
  cmd.editReply({ ...(payload as Discord.InteractionUpdateOptions), message: cmd.message });
 }
};

const getComponents = (
 options: Discord.SelectMenuComponentOptionData[],
 lan: CT.Language['slashCommands']['roles']['builders'],
 message: Discord.Message,
 type: 'button-roles' | 'reaction-roles',
) => [
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   {
    type: Discord.ComponentType.StringSelect,
    customId: `roles/${type}`,
    maxValues: 1,
    minValues: 1,
    placeholder: lan.chooseEmoji,
    disabled: !options.length,
    options: options.length
     ? options
     : [
        {
         label: '-',
         value: '-',
        },
       ],
   },
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   {
    type: Discord.ComponentType.Button,
    customId: `roles/${type}/refresh`,
    label: lan.refreshCommand,
    style: Discord.ButtonStyle.Secondary,
    emoji: client.util.emotes.refresh,
   },
   {
    type: Discord.ComponentType.Button,
    label: lan.reactHere,
    style: Discord.ButtonStyle.Link,
    url: message.url,
   },
   {
    type: Discord.ComponentType.Button,
    customId: `roles/${type}/resetReactions`,
    label: lan.resetReactions,
    style: Discord.ButtonStyle.Secondary,
    emoji: client.util.emotes.trash,
   },
  ],
 },
];

export const getBaseSettings = (
 type: 'button-roles' | 'reaction-roles',
 guildid: string,
 msgid: string,
) =>
 type === 'button-roles'
  ? client.util.DataBase.buttonrolesettings.findFirst({
     where: { guildid, msgid },
    })
  : client.util.DataBase.reactionrolesettings.findFirst({
     where: { guildid, msgid },
    });

export const getSpecificSettings = (
 type: Type,
 guildid: string,
 linkedid: Prisma.Decimal,
 emote?: string,
) =>
 type === 'button-roles'
  ? client.util.DataBase.buttonroles.findMany({
     where: { guildid, linkedid: String(linkedid), emote },
    })
  : client.util.DataBase.reactionroles.findMany({
     where: { guildid, linkedid: String(linkedid), emote },
    });

const createBaseSettings = (
 type: 'button-roles' | 'reaction-roles',
 guildid: string,
 channelid: string,
 msgid: string,
) => {
 const data = {
  guildid,
  channelid,
  msgid,
  uniquetimestamp: Date.now(),
  active: true,
 };

 const select = {
  guildid: true,
  msgid: true,
  channelid: true,
  uniquetimestamp: true,
  active: true,
 };

 if (type === 'button-roles') {
  return client.util.DataBase.buttonrolesettings.create({
   data: { ...data, onlyone: false },
   select,
  });
 }

 return client.util.DataBase.reactionrolesettings.create({ data, select });
};
