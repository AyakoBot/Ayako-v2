import Prisma from '@prisma/client';
import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import client, { API } from '../../../BaseClient/Bot/Client.js';
import * as CT from '../../../Typings/Typings.js';
import getPathFromError from '../../../BaseClient/UtilModules/getPathFromError.js';

export default async (cmd: Discord.ModalSubmitInteraction, args: string[], accept = true) => {
 if (!cmd.inCachedGuild()) return;

 const language = await client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.suggest;

 const suggestion = await client.util.DataBase.suggestionvotes.findUnique({
  where: { msgid: args[0] },
 });
 if (!suggestion) {
  client.util.errorCmd(cmd, lan.notFound, language);
  return;
 }

 const message = await client.util.getMessage(
  client.util.constants.standard.msgurl(cmd.guildId, cmd.channelId ?? '', args[0]),
 );
 if (!message || !message.inGuild()) {
  client.util.errorCmd(cmd, lan.notFound, language);
  return;
 }

 const paragraph = cmd.fields.getField('paragraph', Discord.ComponentType.TextInput)?.value;
 const short = cmd.fields.getField('short', Discord.ComponentType.TextInput)?.value;

 const embed: Discord.APIEmbed = {
  author: {
   name: accept ? lan.accepted : lan.rejected,
   url: client.util.constants.standard.invite,
  },
  color: accept ? CT.Colors.Success : CT.Colors.Danger,
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
      label: language.t.Delete,
      emoji: client.util.emotes.trash,
      custom_id: `suggestion/delete`,
     },
    ],
   },
  ],
 };

 if (message.author.id === process.env.mainId) {
  API.channels.editMessage(message.channelId, message.id, payload);
 } else if (await client.util.isEditable(message)) {
  client.util.request.channels.editMsg(message, payload);
 }

 const where = accept ? { deleteapproved: true } : { deletedenied: true };

 const settings = await client.util.DataBase.suggestionsettings.findUnique({
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
  client.util.DataBase.suggestionvotes
   .delete({
    where: { msgid: message.id },
   })
   .then();
  return;
 }

 client.util.DataBase.suggestionvotes.update({
  where: { msgid: message.id },
  data: { approved: accept },
 });

 client.util.cache.deleteSuggestions.set(
  Jobs.scheduleJob(
   getPathFromError(new Error(cmd.guildId)),
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
 const message = await client.util.getMessage(
  client.util.constants.standard.msgurl(suggestion.guildid, suggestion.channelid, suggestion.msgid),
 );

 if (!message || !message.inGuild()) {
  client.util.DataBase.suggestionvotes.delete({ where: { msgid: suggestion.msgid } }).then();
  return;
 }

 if (message.author.id === process.env.mainId) {
  API.channels.deleteMessage(message.channelId, message.id);
 } else if (await client.util.isDeleteable(message)) {
  client.util.request.channels.deleteMessage(message);
 }
};
