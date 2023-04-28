import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import type DBT from '../../../Typings/DataBaseTypings';

export default async (cmd: Discord.CommandInteraction) => {
 buildEmbed(cmd);
};

export const buildEmbed = async (
 cmd: Discord.CommandInteraction | Discord.ButtonInteraction | Discord.StringSelectMenuInteraction,
 selectedOption?: string,
) => {
 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.embedbuilder.create;
 const options = await getOptions(cmd);

 const payload = {
  embeds: [
   {
    author: {
     name: lan.author,
    },
    description: lan.start.desc,
    color: ch.constants.colors.ephemeral,
   },
  ],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      label: lan.start.methods.startOver,
      customId: 'embed-builder/startOver',
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Primary,
     },
     {
      label: lan.start.methods.inheritCode,
      customId: 'embed-builder/inheritCode',
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Primary,
     },
    ],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.StringSelect,
      customId: 'embed-builder/select',
      minValues: 1,
      maxValues: 1,
      placeholder: lan.start.methods.selectSaved,
      options: options.length
       ? options.map((o) => ({
          label: o.name,
          value: o.uniquetimestamp,
          default: o.uniquetimestamp === selectedOption,
         }))
       : [
          {
           label: '-',
           value: '-',
          },
         ],
      disabled: !options.length,
     },
    ],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      label: lan.start.methods.inheritCustom,
      customId: 'embed-builder/inheritCustom',
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Primary,
      disabled: !selectedOption,
     },
     {
      label: lan.start.methods.deleteCustom,
      customId: 'embed-builder/deleteCustom',
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Danger,
      disabled:
       !selectedOption ||
       !cmd.memberPermissions?.has(Discord.PermissionsBitField.Flags.ManageGuild),
     },
    ],
   },
  ],
 };

 if (cmd.isStringSelectMenu() || cmd.isButton()) {
  cmd.update(payload as Discord.InteractionUpdateOptions);
 } else ch.replyCmd(cmd, { ...payload, ephemeral: true } as Discord.InteractionReplyOptions);
};

const getOptions = async (
 cmd: Discord.CommandInteraction | Discord.ButtonInteraction | Discord.StringSelectMenuInteraction,
) =>
 ch
  .query('SELECT * FROM customembeds WHERE guildid = $1;', [cmd.guildId])
  .then((r: DBT.customembeds[] | null) => r ?? []);
