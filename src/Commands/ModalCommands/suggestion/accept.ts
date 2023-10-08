import Prisma from '@prisma/client';
import * as Jobs from 'node-schedule';
import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/CustomTypings.js';

export default async (cmd: Discord.ModalSubmitInteraction, args: string[], accept = true) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.suggest;

 const suggestion = await ch.DataBase.suggestionvotes.findUnique({
  where: { msgid: args[0] },
 });
 if (!suggestion) {
  ch.errorCmd(cmd, lan.notFound, language);
  return;
 }

 const message = await ch.getMessage(
  ch.constants.standard.msgurl(cmd.guildId, cmd.channelId ?? '', args[0]),
 );
 if (!message || !message.inGuild()) {
  ch.errorCmd(cmd, lan.notFound, language);
  return;
 }

 const paragraph = cmd.fields.getField('paragraph', Discord.ComponentType.TextInput)?.value;
 const short = cmd.fields.getField('short', Discord.ComponentType.TextInput)?.value;

 const embed: Discord.APIEmbed = {
  author: {
   name: accept ? lan.accepted : lan.rejected,
   url: ch.constants.standard.invite,
  },
  color: accept ? ch.constants.colors.success : ch.constants.colors.danger,
  description: paragraph.length ? paragraph : undefined,
  fields: short.length
   ? [
      {
       name: lan.tldr,
       value: short,
      },
     ]
   : undefined,
 };

 cmd.deferUpdate();

 const payload: Omit<CT.UsualMessagePayload, 'files'> = {
  embeds: [...message.embeds.map((e) => e.data), embed],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      style: Discord.ButtonStyle.Secondary,
      label: language.Delete,
      emoji: ch.emotes.trash,
      custom_id: `suggestion/delete`,
     },
    ],
   },
  ],
 };

 if (message.author.id === ch.mainID) {
  message.edit(payload);
 } else if (await ch.isEditable(message)) {
  ch.request.channels.editMsg(message, payload);
 }

 const where = accept ? { deleteapproved: true } : { deletedenied: true };

 const settings = await ch.DataBase.suggestionsettings.findUnique({
  where: {
   ...where,
   guildid: cmd.guildId,
   active: true,
  },
  select: {
   deleteapprovedafter: accept,
   deletedeniedafter: !accept,
  },
 });

 if (!settings) {
  ch.DataBase.suggestionvotes
   .delete({
    where: { msgid: message.id },
   })
   .then();
  return;
 }

 ch.DataBase.suggestionvotes.update({
  where: { msgid: message.id },
  data: { approved: accept },
 });

 ch.cache.deleteSuggestions.set(
  Jobs.scheduleJob(
   new Date(
    Date.now() +
     (Number(settings.deleteapprovedafter) || Number(settings.deletedeniedafter)) * 1000,
   ),
   async () => {
    endDeleteSuggestion(suggestion);
   },
  ),
  cmd.guildId,
  message.id,
 );
};

export const endDeleteSuggestion = async (suggestion: Prisma.suggestionvotes) => {
 const message = await ch.getMessage(
  ch.constants.standard.msgurl(suggestion.guildid, suggestion.channelid, suggestion.msgid),
 );

 if (!message || !message.inGuild()) {
  ch.DataBase.suggestionvotes.delete({ where: { msgid: suggestion.msgid } }).then();
  return;
 }

 if (message.author.id === ch.mainID) message.delete();
 else if (await ch.isDeleteable(message)) ch.request.channels.deleteMessage(message);
};
