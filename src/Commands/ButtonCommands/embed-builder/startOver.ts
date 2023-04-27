import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (
 cmd: Discord.ButtonInteraction | Discord.ModalMessageModalSubmitInteraction,
 _: string[],
 embed?: Discord.APIEmbed,
) => {
 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.embedbuilder.create;

 if (
  embed &&
  (embed?.description === lan.desc || embed.thumbnail?.url === ch.objectEmotes.warning.link) &&
  (embed.title ||
   embed.author?.name ||
   embed.description ||
   embed.footer?.text ||
   embed.fields?.length)
 ) {
  embed.color = undefined;
  embed.description = undefined;
  embed.fields = undefined;
  embed.thumbnail = undefined;
 }

 if (
  !embed?.description &&
  !embed?.title &&
  !embed?.author?.name &&
  !embed?.footer?.text &&
  !embed?.fields?.length
 ) {
  embed = {
   color: ch.constants.colors.danger,
   thumbnail: {
    url: ch.objectEmotes.warning.link,
   },
   description: `${lan.oneRequired}\n${ch.constants.customembeds.needsOneOf
    .map((n) => lan.embedProperties[n as keyof typeof lan.embedProperties])
    .filter((a): a is string => !!a)
    .join(', ')}`,
  };
 }

 cmd.update({
  embeds: [
   embed,
   {
    color: ch.colorSelector(cmd.guild?.members.me),
    description: lan.desc,
   },
  ],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      label: lan.start.createButtons['author-name'],
      style: Discord.ButtonStyle.Secondary,
      customId: 'embed-builder/create/string_author-name',
     },
     {
      type: Discord.ComponentType.Button,
      label: lan.start.createButtons['author-icon'],
      style: Discord.ButtonStyle.Secondary,
      customId: 'embed-builder/create/img_author-icon',
     },
     {
      type: Discord.ComponentType.Button,
      label: lan.start.createButtons['author-url'],
      style: Discord.ButtonStyle.Secondary,
      customId: 'embed-builder/create/link_author-url',
     },
     {
      type: Discord.ComponentType.Button,
      label: lan.start.createButtons['thumbnail'],
      style: Discord.ButtonStyle.Secondary,
      customId: 'embed-builder/create/img_thumbnail',
     },
    ],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      label: lan.start.createButtons['title'],
      style: Discord.ButtonStyle.Secondary,
      customId: 'embed-builder/create/string_title',
     },
     {
      type: Discord.ComponentType.Button,
      label: lan.start.createButtons['url'],
      style: Discord.ButtonStyle.Secondary,
      customId: 'embed-builder/create/link_url',
     },
     {
      type: Discord.ComponentType.Button,
      label: lan.start.createButtons['description'],
      style: Discord.ButtonStyle.Secondary,
      customId: 'embed-builder/create/string_description',
     },
     {
      type: Discord.ComponentType.Button,
      label: lan.start.createButtons['image'],
      style: Discord.ButtonStyle.Secondary,
      customId: 'embed-builder/create/img_image',
     },
     {
      type: Discord.ComponentType.Button,
      label: lan.start.createButtons['color'],
      style: Discord.ButtonStyle.Secondary,
      customId: 'embed-builder/create/hex_color',
     },
    ],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      label: lan.start.createButtons['footer-text'],
      style: Discord.ButtonStyle.Secondary,
      customId: 'embed-builder/create/string_footer-text',
     },
     {
      type: Discord.ComponentType.Button,
      label: lan.start.createButtons['footer-icon'],
      style: Discord.ButtonStyle.Secondary,
      customId: 'embed-builder/create/img_footer-icon',
     },
     {
      type: Discord.ComponentType.Button,
      label: lan.start.createButtons['timestamp'],
      style: Discord.ButtonStyle.Secondary,
      customId: 'embed-builder/create/timestamp_timestamp',
     },
    ],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.StringSelect,
      placeholder: lan.start.fieldPlaceholder,
      maxValues: 1,
      minValues: 1,
      customId: 'embed-builder/create/field/select',
      options: [
       {
        label: lan.start.createButtons.addField,
        value: 'create',
        emoji: ch.objectEmotes.plusBG,
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
      label: lan.start.selectedField('None'),
      style: Discord.ButtonStyle.Primary,
      customId: 'null',
      disabled: true,
     },
     {
      type: Discord.ComponentType.Button,
      label: lan.start.createButtons['field-names'],
      style: Discord.ButtonStyle.Secondary,
      customId: 'embed-builder/create/string_field-name',
      disabled: true,
     },
     {
      type: Discord.ComponentType.Button,
      label: lan.start.createButtons['field-values'],
      style: Discord.ButtonStyle.Secondary,
      customId: 'embed-builder/create/string_field-value',
      disabled: true,
     },
     {
      type: Discord.ComponentType.Button,
      label: lan.start.createButtons['field-inline'],
      style: Discord.ButtonStyle.Secondary,
      customId: 'embed-builder/create/boolean_field-inline',
      disabled: true,
     },
     {
      type: Discord.ComponentType.Button,
      label: lan.start.createButtons.removeField,
      style: Discord.ButtonStyle.Danger,
      customId: 'embed-builder/create/delete',
      disabled: true,
     },
    ],
   },
  ],
 });
};
