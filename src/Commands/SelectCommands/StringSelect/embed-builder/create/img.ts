import * as Discord from 'discord.js';

export default async (cmd: Discord.StringSelectMenuInteraction, args: string[]) => {
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.embedbuilder.create.start;

 let title = lan.createButtons.selectMenu[args[0] as keyof typeof lan.createButtons.selectMenu];
 if (!title) {
  title = lan.createButtons.fieldButtons[args[0] as keyof typeof lan.createButtons.fieldButtons];
 }

 cmd.showModal({
  title,
  customId: `embed-builder/editor_${args[0]}`,
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.TextInput,
      style: Discord.TextInputStyle.Short,
      customId: 'input',
      label: lan.modals.img.label,
      maxLength: 200,
      minLength: 0,
      placeholder: lan.modals.img.placeholder,
      required: false,
      value: getValue(args[0], cmd),
     },
    ],
   },
  ],
 });
};

const getValue = (arg: string, cmd: Discord.StringSelectMenuInteraction) => {
 const embed = cmd.message.embeds[1];
 if (!embed) return '';

 switch (arg) {
  case 'author-icon':
   return embed.author?.iconURL ?? '';
  case 'image':
   return embed.image?.url ?? '';
  case 'thumbnail':
   return embed.thumbnail?.url ?? '';
  case 'footer-icon':
   return embed.footer?.iconURL ?? '';
  default:
   return '';
 }
};
