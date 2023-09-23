import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (
 cmd:
  | Discord.ButtonInteraction
  | Discord.ModalMessageModalSubmitInteraction
  | Discord.StringSelectMenuInteraction,
 _: string[],
 embed?: Discord.APIEmbed,
 selectedField?: number | null,
) => {
 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.embedbuilder.create;
 let canFinish = true;

 if (
  !embed?.description &&
  !embed?.fields?.length &&
  !embed?.title &&
  !embed?.footer?.text &&
  !embed?.image?.url &&
  !embed?.thumbnail?.url &&
  !embed?.author?.name
 ) {
  embed = {
   description: lan.yourEmbed,
  };

  canFinish = false;
 }

 const options: Discord.SelectMenuComponentOptionData[] = embed.fields?.length
  ? embed.fields?.map((_1, i) => ({
     label: lan.start['field-nr'](i),
     value: String(i),
     default: i === selectedField,
    }))
  : [];

 if (options.length < 25) {
  options.push({
   label: lan.start.createButtons.addField,
   value: 'create',
   emoji: ch.emotes.plusBG,
  });
 }

 cmd.update({
  embeds: [
   embed,
   {
    color: ch.colorSelector(await ch.getBotMemberFromGuild(cmd.guild)),
    description: `${lan.desc}\n\n${lan.oneRequired}\n${ch.constants.customembeds.needsOneOf
     .map((n) => lan.embedProperties[n as keyof typeof lan.embedProperties])
     .filter((a): a is string => !!a)
     .join(', ')}`,
    fields: lan.fields.map((f) => ({ name: '\u200b', value: `${lan.quick}\n${f}` })),
   },
  ],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.StringSelect,
      placeholder: lan.start.selectPlaceholder,
      maxValues: 1,
      minValues: 1,
      customId: 'embed-builder/create/select',
      options: Object.entries(lan.start.createButtons.selectMenu).map(([k, v]) => ({
       label: v,
       value: `${
        ch.constants.customembeds.type[k as keyof typeof ch.constants.customembeds.type]
       }_${k}`,
      })),
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
      customId: 'embed-builder/create/fields',
      options,
     },
    ],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      label: lan.start.createButtons.fieldButtons['field-name'],
      style: Discord.ButtonStyle.Secondary,
      customId: 'embed-builder/create/string_field-name',
      disabled: typeof selectedField !== 'number',
     },
     {
      type: Discord.ComponentType.Button,
      label: lan.start.createButtons.fieldButtons['field-value'],
      style: Discord.ButtonStyle.Secondary,
      customId: 'embed-builder/create/string_field-value',
      disabled: typeof selectedField !== 'number',
     },
     {
      type: Discord.ComponentType.Button,
      label: lan.start.createButtons.fieldButtons['field-inline'],
      style: Discord.ButtonStyle.Secondary,
      customId: 'embed-builder/create/boolean',
      disabled: typeof selectedField !== 'number',
     },
     {
      type: Discord.ComponentType.Button,
      label: lan.start.createButtons.removeField,
      style: Discord.ButtonStyle.Danger,
      customId: 'embed-builder/create/delete',
      disabled: typeof selectedField !== 'number',
     },
    ],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      label: lan.start.createButtons.save,
      style: Discord.ButtonStyle.Success,
      customId: 'embed-builder/save',
      disabled:
       !canFinish || !cmd.memberPermissions?.has(Discord.PermissionsBitField.Flags.ManageGuild),
     },
     {
      type: Discord.ComponentType.Button,
      label: lan.start.createButtons.send,
      style: Discord.ButtonStyle.Success,
      customId: 'embed-builder/send',
      disabled:
       !canFinish || !cmd.memberPermissions?.has(Discord.PermissionsBitField.Flags.ManageGuild),
     },
     {
      type: Discord.ComponentType.Button,
      label: lan.start.createButtons.edit,
      style: Discord.ButtonStyle.Success,
      customId: 'embed-builder/edit',
      disabled:
       !canFinish || !cmd.memberPermissions?.has(Discord.PermissionsBitField.Flags.ManageGuild),
     },
    ],
   },
  ],
 });
};
