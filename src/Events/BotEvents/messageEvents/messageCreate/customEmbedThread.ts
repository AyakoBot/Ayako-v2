import * as Discord from 'discord.js';
import { EmbedFields } from '../../../../BaseClient/Other/constants/customEmbeds.js';
import { getSelectedField } from '../../../../Commands/ButtonCommands/embed-builder/deleteCustom.js';
import { getLength } from '../../../../Commands/SelectCommands/StringSelect/embed-builder/create/string.js';
import startOver from '../../../../Commands/ButtonCommands/embed-builder/startOver.js';

export default async (msg: Discord.Message<true>) => {
 if (!msg.guild) return;
 if (msg.channel.type !== Discord.ChannelType.PrivateThread) return;

 const filter = (m: Discord.Message) => {
  const url = new URL(m.embeds[0]?.url ?? 'https://ayakobot.com');
  if (url.searchParams.get('isEmbedBuilder') !== 'true') return false;
  if (url.searchParams.get('exec') !== msg.author.id) return false;
  return true;
 };

 const initMessage =
  msg.channel.messages.cache.find(filter) ??
  (
   await msg.client.util.request.channels
    .getMessages(msg.channel, { limit: 100 })
    .then((m) => ('message' in m ? undefined : m))
  )?.find(filter);
 if (!initMessage) return;

 const editType = getSelectedProperty(initMessage);
 if (!editType) return;

 const embed = structuredClone(initMessage.embeds[1].data) as Discord.APIEmbed;
 const content = msg.content.slice(0, getLength(editType));

 msg.client.util.request.channels.deleteMessage(msg);

 switch (editType) {
  case EmbedFields.Title:
   embed.title = content;
   break;
  case EmbedFields.Description:
   embed.description = content;
   break;
  case EmbedFields.FieldName:
   embed.fields![getSelectedField(initMessage)].name = content;
   break;
  case EmbedFields.FieldValue:
   embed.fields![getSelectedField(initMessage)].value = content;
   break;
  default:
   throw new Error('Invalid argument');
 }

 startOver(initMessage, [], embed, getSelectedField(initMessage), editType);
};

export const getSelectedProperty = (msg: Discord.Message<true>) =>
 msg.components[0].type === Discord.ComponentType.ActionRow
  ? ((msg.components[0].components[0] as Discord.StringSelectMenuComponent).data.options
     .find((o) => o.default)
     ?.value.split(/_+/g)[1] as EmbedFields | undefined)
  : undefined;
