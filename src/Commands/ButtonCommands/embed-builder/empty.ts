import * as Discord from 'discord.js';
import { EmbedFields } from '../../../BaseClient/Other/constants/customEmbeds.js';
import { getSelectedProperty } from '../../../Events/BotEvents/messageEvents/messageCreate/customEmbedThread.js';
import { getSelectedField } from './deleteCustom.js';
import startOver from './startOver.js';

export default async (cmd: Discord.ButtonInteraction) => {
 if (!cmd.inCachedGuild()) return;
 if (!cmd.channel) return;

 const filter = (m: Discord.Message) => {
  const url = new URL(m.embeds[0]?.url ?? 'https://ayakobot.com');
  if (url.searchParams.get('isEmbedBuilder') !== 'true') return false;
  if (url.searchParams.get('exec') !== cmd.user.id) return false;
  return true;
 };

 const initMessage =
  cmd.channel.messages.cache.find(filter) ??
  (
   await cmd.client.util.request.channels
    .getMessages(cmd.channel, { limit: 100 })
    .then((m) => ('message' in m ? undefined : m))
  )?.find(filter);
 if (!initMessage) return;

 const editType = getSelectedProperty(initMessage);
 if (!editType) return;

 const embed = structuredClone(initMessage.embeds[1].data) as Discord.APIEmbed;

 switch (editType) {
  case EmbedFields.Title:
   embed.title = undefined;
   break;
  case EmbedFields.Description:
   embed.description = undefined;
   break;
  case EmbedFields.FieldName:
   embed.fields![getSelectedField(initMessage)].name = '\u200b';
   break;
  case EmbedFields.FieldValue:
   embed.fields![getSelectedField(initMessage)].value = '\u200b';
   break;
  default:
   throw new Error('Invalid argument');
 }

 if (
  !embed.title?.length &&
  !embed.author?.name?.length &&
  !embed.description?.length &&
  !embed.thumbnail?.url?.length &&
  !embed.fields?.length &&
  !embed.image?.url?.length &&
  !embed.footer?.text?.length
 ) {
  const language = await cmd.client.util.getLanguage(cmd.guildId);
  const lan = language.slashCommands.embedbuilder;

  cmd.client.util.errorCmd(
   cmd,
   `${lan.create.oneRequired}\n${Object.values(lan.create.embedProperties)
    .map((p) => Discord.inlineCode(p))
    .join(', ')}`,
   language,
  );
  return;
 }

 startOver(cmd, [], embed, getSelectedField(initMessage), editType);
};
