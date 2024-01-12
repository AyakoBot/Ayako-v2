import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';
import client from '../../../../BaseClient/Bot/Client.js';
import type { Type } from '../../../SlashCommands/roles/builders/button-roles.js';

export default async (
 cmd: Discord.StringSelectMenuInteraction,
 _: string[],
 type: Type = 'button-roles',
) => {
 if (!cmd.inCachedGuild()) return;

 const language = await client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.roles.builders;
 const where = { where: { uniquetimestamp: cmd.values[0] } };

 const getValue = () =>
  type === 'button-roles'
   ? client.util.DataBase.buttonroles.findUnique(where).then((s) => s?.emote)
   : client.util.DataBase.reactionroles.findUnique(where).then((s) => s?.emote);

 const value =
  cmd.values[0].includes(':') || !Discord.parseEmoji(cmd.values[0])?.id
   ? cmd.values[0]
   : await getValue();

 if (!value) {
  client.util.errorCmd(cmd, language.errors.emoteNotFound, language);
  return;
 }

 const embed = JSON.parse(JSON.stringify(cmd.message.embeds[0].data)) as Discord.APIEmbed;

 embed.description =
  type === 'reaction-roles'
   ? lan.descReactions((await client.util.getCustomCommand(cmd.guild, 'settings'))?.id ?? '0')
   : lan.descButtons((await client.util.getCustomCommand(cmd.guild, 'settings'))?.id ?? '0');
 embed.fields = [
  ...(embed.fields ?? []),
  ...(findField(Discord.parseEmoji(value) as Discord.PartialEmoji, embed.fields)
   ? []
   : [
      {
       name: `${
        !Discord.parseEmoji(value)?.id ? value : `<${value.startsWith('a:') ? '' : ':'}${value}>`
       } / ${client.util.util.makeInlineCode(value)}`,
       value: language.t.None,
      },
     ]),
 ];

 cmd.update({
  embeds: [embed],
  components: getComponents(
   Discord.parseEmoji(value) as Discord.PartialEmoji,
   lan,
   language,
   [],
   type,
  ),
 });
};

export const getComponents = (
 emoji: Discord.PartialEmoji,
 lan: CT.Language['slashCommands']['roles']['builders'],
 language: CT.Language,
 roles: string[],
 type: 'button-roles' | 'reaction-roles',
): [
 Discord.APIActionRowComponent<Discord.APIButtonComponent>,
 Discord.APIActionRowComponent<Discord.APIRoleSelectComponent>,
 Discord.APIActionRowComponent<Discord.APIButtonComponent>,
] => [
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   {
    type: Discord.ComponentType.Button,
    custom_id: '-1',
    style: Discord.ButtonStyle.Secondary,
    disabled: true,
    label: lan.selectedEmoji,
   },
   {
    type: Discord.ComponentType.Button,
    custom_id: `-2`,
    label: emoji.name ?? emoji.id,
    emoji: emoji.name
     ? {
        id: emoji.id,
        name: emoji.name,
        animated: emoji.animated,
       }
     : {
        name: emoji.id,
       },
    style: Discord.ButtonStyle.Secondary,
    disabled: true,
   },
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   {
    type: Discord.ComponentType.RoleSelect,
    custom_id: `roles/${type}_${client.util.constants.standard.getEmoteIdentifier(emoji)}`,
    placeholder: lan.chooseRoles,
    min_values: 1,
    max_values: 10,
   },
  ],
 },
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   {
    type: Discord.ComponentType.Button,
    custom_id: `roles/${type}/refresh`,
    emoji: client.util.emotes.back,
    style: Discord.ButtonStyle.Secondary,
   },
   {
    type: Discord.ComponentType.Button,
    custom_id: `roles/${type}/save_${client.util.constants.standard.getEmoteIdentifier(emoji)}`,
    emoji: client.util.emotes.tickWithBackground,
    style: Discord.ButtonStyle.Success,
    label: lan.saveAndExit,
    disabled: !roles.length,
   },
   {
    type: Discord.ComponentType.Button,
    custom_id: `roles/${type}/delete_${client.util.constants.standard.getEmoteIdentifier(emoji)}`,
    emoji: client.util.emotes.trash,
    style: Discord.ButtonStyle.Secondary,
    label: language.t.Delete,
   },
  ],
 },
];

export const findField = (
 emoji: Discord.PartialEmoji,
 fields: Discord.APIEmbedField[] | undefined,
) =>
 fields?.find((f) =>
  !emoji.id
   ? f.name ===
     `${client.util.constants.standard.getEmote(emoji)} / ${client.util.util.makeInlineCode(
      client.util.constants.standard.getEmoteIdentifier(emoji),
     )}`
   : [
      `${client.util.constants.standard.getEmote(emoji)} / ${client.util.util.makeInlineCode(
       client.util.constants.standard.getEmoteIdentifier(emoji),
      )}`,
      `:${emoji.name}: / ${client.util.util.makeInlineCode(
       client.util.constants.standard.getEmoteIdentifier(emoji),
      )}`,
     ].includes(f.name),
 );
