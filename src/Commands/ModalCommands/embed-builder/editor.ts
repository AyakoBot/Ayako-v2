import * as Discord from 'discord.js';
import startOver from '../../ButtonCommands/embed-builder/startOver.js';
import { getSelectedField } from '../../ButtonCommands/embed-builder/deleteCustom.js';
import { EmbedFields } from '../../../BaseClient/Other/constants/customEmbeds.js';

export default async (cmd: Discord.ModalSubmitInteraction, args: string[]) => {
 if (!cmd.isFromMessage()) return;

 const fieldType = args.shift() as EmbedFields;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const newValue = cmd.fields.getTextInputValue('input') || undefined;
 const lan = language.slashCommands.embedbuilder.create.start;
 const selectedField = getSelectedField(cmd.message);

 try {
  const testEmbed = new Discord.EmbedBuilder();

  switch (fieldType) {
   case EmbedFields.FieldName: {
    testEmbed.addFields({ name: newValue || '\u200b', value: '\u200b' });
    break;
   }
   case EmbedFields.FieldInline: {
    testEmbed.addFields({ name: '\u200b', value: '\u200b', inline: newValue === 'true' });
    break;
   }
   case EmbedFields.FieldValue: {
    testEmbed.addFields({ name: '\u200b', value: newValue || '\u200b' });
    break;
   }
   case EmbedFields.Timestamp: {
    if (!newValue) testEmbed.setTimestamp();
    else if (newValue.toLowerCase() === lan.modals.timestamp.now) testEmbed.setTimestamp();
    else if (!Number.isNaN(+newValue)) testEmbed.setTimestamp(new Date(Number(newValue) * 1000));
    else if (newValue.startsWith('<t:')) {
     testEmbed.setTimestamp(new Date(Number(newValue.replace(/\D+/g, ''))));
    } else testEmbed.setTimestamp(new Date(newValue));
    break;
   }
   case EmbedFields.FooterIcon: {
    testEmbed.setFooter({ text: '\u200b', iconURL: newValue });
    break;
   }
   case EmbedFields.FooterText: {
    testEmbed.setFooter({ text: newValue || '\u200b' });
    break;
   }
   case EmbedFields.Color: {
    if (!newValue) testEmbed.setColor(null);
    else {
     testEmbed.setColor(
      newValue === 'random'
       ? 'Random'
       : (cmd.client.util.getColor(newValue) as Discord.ColorResolvable),
     );
    }
    break;
   }
   case EmbedFields.Image: {
    testEmbed.setImage(newValue ?? null);
    break;
   }
   case EmbedFields.Description: {
    testEmbed.setDescription(newValue ?? null);
    break;
   }
   case EmbedFields.URL: {
    testEmbed.setURL(newValue ?? null);
    break;
   }
   case EmbedFields.Title: {
    testEmbed.setTitle(newValue ?? null);
    break;
   }
   case EmbedFields.Thumbnail: {
    testEmbed.setThumbnail(newValue ?? null);
    break;
   }
   case EmbedFields.AuthorURL: {
    testEmbed.setAuthor({ name: '\u200b', url: newValue });
    break;
   }
   case EmbedFields.AuthorIcon: {
    testEmbed.setAuthor({ name: '\u200b', iconURL: newValue });
    break;
   }
   case EmbedFields.AuthorName: {
    testEmbed.setAuthor({ name: newValue || '\u200b' });
    break;
   }
   default: {
    throw new Error('Invalid Field Type. Please report this on the Support Server.');
   }
  }
 } catch (e) {
  cmd.client.util.errorCmd(
   cmd,
   JSON.stringify(e, null, 2)
    .replace(/[{|}|[|\]|"|,]/g, '')
    .split(/\n+/)
    .filter((m) => m.includes('given') || m.includes('expected'))
    .join('\n'),
   language,
  );

  return;
 }

 const embed = new Discord.EmbedBuilder(cmd.message.embeds[1].data);

 switch (fieldType) {
  case EmbedFields.FieldName: {
   if (!embed.data.fields?.length) return;
   const { fields } = embed.data;
   fields[Number(selectedField)].name = newValue || '\u200b';
   break;
  }
  case EmbedFields.FieldValue: {
   if (!embed.data.fields?.length) return;
   const { fields } = embed.data;
   fields[Number(selectedField)].value = newValue || '\u200b';
   break;
  }
  case EmbedFields.Timestamp: {
   if (!newValue) embed.setTimestamp();
   else if (newValue.toLowerCase() === lan.modals.timestamp.now) embed.setTimestamp();
   else if (!Number.isNaN(+newValue)) embed.setTimestamp(new Date(Number(newValue) * 1000));
   else if (newValue.startsWith('<t:')) {
    embed.setTimestamp(new Date(Number(newValue.replace(/\D+/g, '')) * 1000));
   } else embed.setTimestamp(new Date(newValue));
   break;
  }
  case EmbedFields.FooterIcon: {
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
  case EmbedFields.FooterText: {
   if (!newValue && !embed.data.footer?.icon_url) embed.setFooter(null);
   else embed.setFooter({ text: newValue || '\u200b', iconURL: embed.data.footer?.icon_url });
   break;
  }
  case EmbedFields.Color: {
   if (!newValue) embed.setColor(null);
   else {
    embed.setColor(
     newValue === 'random'
      ? 'Random'
      : (cmd.client.util.getColor(newValue) as Discord.ColorResolvable),
    );
   }
   break;
  }
  case EmbedFields.Image: {
   if (!newValue) embed.setImage(null);
   else embed.setImage(newValue);
   break;
  }
  case EmbedFields.Description: {
   embed.setDescription(newValue || null);
   break;
  }
  case EmbedFields.URL: {
   if (!newValue) embed.setURL(null);
   else embed.setURL(newValue);
   break;
  }
  case EmbedFields.Title: {
   if (!newValue) embed.setTitle(null);
   else embed.setTitle(newValue);
   break;
  }
  case EmbedFields.Thumbnail: {
   if (!newValue) embed.setThumbnail(null);
   else embed.setThumbnail(newValue);
   break;
  }
  case EmbedFields.AuthorURL: {
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
  case EmbedFields.AuthorIcon: {
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
  case EmbedFields.AuthorName: {
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
