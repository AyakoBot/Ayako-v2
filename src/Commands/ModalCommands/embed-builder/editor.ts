import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import startOver from '../../ButtonCommands/embed-builder/startOver.js';

export default async (cmd: Discord.ModalSubmitInteraction, args: string[]) => {
 if (!cmd.isFromMessage()) return;

 const fieldType = args.shift() as
  | 'field-name'
  | 'field-value'
  | 'field-inline'
  | 'timestamp'
  | 'footer-icon'
  | 'footer-text'
  | 'color'
  | 'image'
  | 'description'
  | 'url'
  | 'title'
  | 'thumbnail'
  | 'author-url'
  | 'author-icon'
  | 'author-name';
 const language = await ch.languageSelector(cmd.guildId);
 const newValue = cmd.fields.getTextInputValue('input') || undefined;
 const lan = language.slashCommands.embedbuilder.create.start;
 const selectedField = getSelectedField(cmd);

 let error: { errors: [{ errors: { expected: string }[] }[]] } | Error | null = null;
 try {
  const testEmbed = new Discord.EmbedBuilder();

  switch (fieldType) {
   case 'field-name': {
    testEmbed.addFields({ name: newValue || '\u200b', value: '\u200b' });
    break;
   }
   case 'field-inline': {
    testEmbed.addFields({ name: '\u200b', value: '\u200b', inline: newValue === 'true' });
    break;
   }
   case 'field-value': {
    testEmbed.addFields({ name: '\u200b', value: newValue || '\u200b' });
    break;
   }
   case 'timestamp': {
    if (!newValue) testEmbed.setTimestamp();
    else if (newValue.toLowerCase() === lan.modals.timestamp.now) testEmbed.setTimestamp();
    else if (!Number.isNaN(+newValue)) testEmbed.setTimestamp(new Date(Number(newValue) * 1000));
    else if (newValue.startsWith('<t:')) {
     testEmbed.setTimestamp(new Date(Number(newValue.replace(/\D+/g, ''))));
    } else testEmbed.setTimestamp(new Date(newValue));
    break;
   }
   case 'footer-icon': {
    testEmbed.setFooter({ text: '\u200b', iconURL: newValue });
    break;
   }
   case 'footer-text': {
    testEmbed.setFooter({ text: newValue || '\u200b' });
    break;
   }
   case 'color': {
    if (!newValue) testEmbed.setColor(null);
    else {
     testEmbed.setColor(
      newValue === 'random' ? 'Random' : (ch.getColor(newValue) as Discord.ColorResolvable),
     );
    }
    break;
   }
   case 'image': {
    testEmbed.setImage(newValue ?? null);
    break;
   }
   case 'description': {
    testEmbed.setDescription(newValue ?? null);
    break;
   }
   case 'url': {
    testEmbed.setURL(newValue ?? null);
    break;
   }
   case 'title': {
    testEmbed.setTitle(newValue ?? null);
    break;
   }
   case 'thumbnail': {
    testEmbed.setThumbnail(newValue ?? null);
    break;
   }
   case 'author-url': {
    testEmbed.setAuthor({ name: '\u200b', url: newValue });
    break;
   }
   case 'author-icon': {
    testEmbed.setAuthor({ name: '\u200b', iconURL: newValue });
    break;
   }
   case 'author-name': {
    testEmbed.setAuthor({ name: newValue || '\u200b' });
    break;
   }
   default: {
    throw new Error('Invalid Field Type. Please report this on the Support Server.');
   }
  }
 } catch (e) {
  error = e as { errors: [{ errors: { expected: string }[] }[]] };
 }

 if (error && 'message' in error) {
  ch.errorCmd(cmd, (error as { message: string }).message, language);
  return;
 }
 if (error) {
  const { errors } = error.errors[0][1];
  ch.errorCmd(cmd, errors.at(-1)?.expected as string, language);
  return;
 }

 const embed = new Discord.EmbedBuilder(cmd.message.embeds[0].data);

 switch (fieldType) {
  case 'field-name': {
   if (!embed.data.fields?.length) return;
   const { fields } = embed.data;
   fields[Number(selectedField)].name = newValue || '\u200b';
   break;
  }
  case 'field-value': {
   if (!embed.data.fields?.length) return;
   const { fields } = embed.data;
   fields[Number(selectedField)].value = newValue || '\u200b';
   break;
  }
  case 'timestamp': {
   if (!newValue) embed.setTimestamp();
   else if (newValue.toLowerCase() === lan.modals.timestamp.now) embed.setTimestamp();
   else if (!Number.isNaN(+newValue)) embed.setTimestamp(new Date(Number(newValue) * 1000));
   else if (newValue.startsWith('<t:')) {
    embed.setTimestamp(new Date(Number(newValue.replace(/\D+/g, '')) * 1000));
   } else embed.setTimestamp(new Date(newValue));
   break;
  }
  case 'footer-icon': {
   if (!embed.data.footer?.text && !embed.data.footer?.icon_url && !newValue) {
    embed.setFooter(null);
   } else {
    embed.setFooter({
     text: embed.data.footer?.text || '\u200b',
     iconURL: newValue || undefined,
    });
   }
   break;
  }
  case 'footer-text': {
   if (!newValue && !embed.data.footer?.icon_url) embed.setFooter(null);
   else embed.setFooter({ text: newValue || '\u200b', iconURL: embed.data.footer?.icon_url });
   break;
  }
  case 'color': {
   if (!newValue) embed.setColor(null);
   else {
    embed.setColor(
     newValue === 'random' ? 'Random' : (ch.getColor(newValue) as Discord.ColorResolvable),
    );
   }
   break;
  }
  case 'image': {
   if (!newValue) embed.setImage(null);
   else embed.setImage(newValue);
   break;
  }
  case 'description': {
   embed.setDescription(newValue || null);
   break;
  }
  case 'url': {
   if (!newValue) embed.setURL(null);
   else embed.setURL(newValue);
   break;
  }
  case 'title': {
   if (!newValue) embed.setTitle(null);
   else embed.setTitle(newValue);
   break;
  }
  case 'thumbnail': {
   if (!newValue) embed.setThumbnail(null);
   else embed.setThumbnail(newValue);
   break;
  }
  case 'author-url': {
   if (!newValue && !embed.data.author?.icon_url && !embed.data.author?.name) {
    embed.setAuthor(null);
   } else {
    embed.setAuthor({
     url: newValue,
     name: embed.data.author?.name || '\u200b',
     iconURL: embed.data.author?.icon_url,
    });
   }
   break;
  }
  case 'author-icon': {
   if (!newValue && !embed.data.author?.url && !embed.data.author?.name) {
    embed.setAuthor(null);
   } else {
    embed.setAuthor({
     iconURL: newValue,
     name: embed.data.author?.name || '\u200b',
     url: embed.data.author?.url,
    });
   }
   break;
  }
  case 'author-name': {
   if (!newValue && !embed.data.author?.icon_url) {
    embed.setAuthor(null);
   } else {
    embed.setAuthor({
     name: newValue || '\u200b',
     iconURL: embed.data.author?.icon_url,
     url: embed.data.author?.url,
    });
   }
   break;
  }
  default: {
   throw new Error('Unknown field type');
  }
 }

 startOver(cmd, args, embed.data, selectedField ? Number(selectedField) : null);
};

export const getSelectedField = (
 cmd:
  | Discord.ModalMessageModalSubmitInteraction
  | Discord.StringSelectMenuInteraction
  | Discord.ButtonInteraction,
) =>
 (cmd.message.components[1].components[0] as Discord.StringSelectMenuComponent).data.options.find(
  (o) => o.default,
 )?.value;
