import { Prisma } from '@prisma/client';
import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';

export type Type = 'button-roles' | 'reaction-roles';

export default async (
 cmd: Discord.ChatInputCommandInteraction | Discord.ButtonInteraction,
 _: [],
 reply?: Discord.InteractionResponse<true>,
 type: Type = 'button-roles',
) => {
 if (!cmd.inCachedGuild()) return;
 if (!reply) reply = await cmd.deferReply({ ephemeral: true });

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.roles.builders;

 const message = await ch.getMessage(
  cmd.isChatInputCommand()
   ? cmd.options.getString('message', true)
   : (cmd.message.embeds[0].url as string),
 );
 if (!message || message.guildId !== cmd.guildId) {
  ch.errorCmd(cmd, language.errors.messageNotFound, language);
  return;
 }

 if (message.author.id !== cmd.client.user.id) {
  ch.errorCmd(
   cmd,
   lan.messageNotFromMe((await ch.getCustomCommand(cmd.guildId, 'embed-builder'))?.id ?? '0'),
   language,
  );
 }

 const baseSettings = await getBaseSettings(type, cmd.guildId, message.id);
 if (!baseSettings) {
  ch.errorCmd(cmd, language.errors.settingNotFound, language);
  return;
 }

 const settings = await getSpecificSettings(type, cmd.guildId, baseSettings.uniquetimestamp);

 await Promise.all(
  message.reactions.cache.map((r) => r.users.fetch({ limit: 1 }).catch(() => undefined)),
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
   emoji: s.emote,
   label: language.Edit,
   value: s.emote ?? s.uniquetimestamp,
  })) ?? []) as Discord.SelectMenuComponentOptionData[]),
  ...applyReactions.map((r) => ({
   emoji: r.emoji.identifier,
   label: language.Add,
   value: !r.emoji.id ? (r.emoji.name as string) : r.emoji.identifier,
  })),
 ].slice(0, 25);

 const payload = {
  embeds: [
   {
    description: `${
     type === 'button-roles'
      ? lan.descButtons((await ch.getCustomCommand(cmd.guildId, 'settings'))?.id ?? '0')
      : lan.descReactions((await ch.getCustomCommand(cmd.guildId, 'settings'))?.id ?? '0')
    }\n\n${lan.buttons}`,
    url: message.url,
    fields: settings
     ?.filter((s) => !!s.emote)
     .map((s) => ({
      name: `${
       !Discord.parseEmoji(s.emote as string)?.id
        ? s.emote
        : `<${s.emote?.startsWith('a:') ? '' : ':'}${s.emote}>`
      } / ${ch.util.makeInlineCode(s.emote as string)}`,
      value: s?.roles?.map((r) => `<@&${r}>`).join(', ') ?? language.None,
     })),
   },
  ],
  components: getComponents(options, lan, message, type),
 };

 if (cmd.isChatInputCommand()) cmd.editReply(payload as Discord.InteractionReplyOptions);
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
    emoji: ch.emotes.refresh,
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
    style: Discord.ButtonStyle.Danger,
    emoji: ch.emotes.trash,
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
  ? ch.DataBase.buttonrolesettings.findFirst({
     where: { guildid, msgid },
    })
  : ch.DataBase.reactionrolesettings.findFirst({
     where: { guildid, msgid },
    });

export const getSpecificSettings = (type: Type, guildid: string, linkedid: Prisma.Decimal) =>
 type === 'button-roles'
  ? ch.DataBase.buttonroles.findMany({
     where: { guildid, linkedid: String(linkedid) },
    })
  : ch.DataBase.reactionroles.findMany({
     where: { guildid, linkedid: String(linkedid) },
    });
