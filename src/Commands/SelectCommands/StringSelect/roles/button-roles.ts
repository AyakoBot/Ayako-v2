import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import * as CT from '../../../../Typings/CustomTypings.js';
import { typeWithoutDash } from '../../../SlashCommands/roles/builders/button-roles.js';

export default async (
 cmd: Discord.StringSelectMenuInteraction,
 _: string[],
 type: 'button-roles' | 'reaction-roles' = 'button-roles',
) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.roles.builders;

 const value =
  cmd.values[0].includes(':') || !Discord.parseEmoji(cmd.values[0])?.id
   ? cmd.values[0]
   : await ch
      .query(
       `SELECT * FROM ${typeWithoutDash(type)} WHERE uniquetimestamp = $1;`,
       [cmd.values[0]],
       {
        returnType: typeWithoutDash(type),
        asArray: false,
       },
      )
      .then((s) => s?.emote);
 if (!value) {
  ch.errorCmd(cmd, language.errors.emoteNotFound, language);
  return;
 }

 const embed = JSON.parse(JSON.stringify(cmd.message.embeds[0].data)) as Discord.APIEmbed;

 embed.description = type === 'reaction-roles' ? lan.descReactions : lan.descButtons;
 embed.fields = [
  ...(embed.fields ?? []),
  ...(findField(value, embed.fields)
   ? []
   : [
      {
       name: `${
        !Discord.parseEmoji(value)?.id ? value : `<${value.startsWith('a:') ? '' : ':'}${value}>`
       } / ${ch.util.makeInlineCode(value)}`,
       value: language.None,
      },
     ]),
 ];

 console.log(cmd.values);

 cmd.update({
  embeds: [embed],
  components: getComponents(cmd.values[0], lan, language, [], type),
 });
};

export const getComponents = (
 emojiIdentifier: string,
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
    label: emojiIdentifier.includes(':') ? emojiIdentifier.split(/:/g)[0] : undefined,
    emoji: emojiIdentifier.includes(':')
     ? {
        id: emojiIdentifier.split(/:/g)[1],
        name: emojiIdentifier.split(/:/g)[0],
        animated: emojiIdentifier.startsWith('a:'),
       }
     : {
        name: emojiIdentifier,
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
    custom_id: `roles/${type}_${emojiIdentifier}`,
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
    emoji: ch.objectEmotes.back,
    style: Discord.ButtonStyle.Secondary,
   },
   {
    type: Discord.ComponentType.Button,
    custom_id: `roles/${type}/save_${emojiIdentifier}`,
    emoji: ch.objectEmotes.tickWithBackground,
    style: Discord.ButtonStyle.Success,
    label: lan.saveAndExit,
    disabled: !roles.length,
   },
   {
    type: Discord.ComponentType.Button,
    custom_id: `roles/${type}/delete_${emojiIdentifier}`,
    emoji: ch.objectEmotes.trash,
    style: Discord.ButtonStyle.Danger,
    label: language.Delete,
   },
  ],
 },
];

export const findField = (emoji: string, fields: Discord.APIEmbedField[] | undefined) =>
 fields?.find((f) =>
  !Discord.parseEmoji(emoji)?.id
   ? f.name === `${emoji} / ${ch.util.makeInlineCode(emoji)}`
   : [
      `<${emoji.startsWith('a:') ? '' : ':'}${emoji}> / ${ch.util.makeInlineCode(emoji)}`,
      `:${emoji.split(/:/g)[0]}: / ${ch.util.makeInlineCode(emoji)}`,
     ].includes(f.name),
 );
