import * as Discord from 'discord.js';
import client from '../../../BaseClient/Bot/Client.js';

export default async (cmd: Discord.ButtonInteraction, _args: string[], up = true) => {
 if (!cmd.inCachedGuild()) return;

 const valid = await isValid(cmd);
 if (!valid) return;
 const { language, lan, settings } = valid;

 if (
  settings.novoteroles.some((r) => cmd.member.roles.cache.has(r)) ||
  settings.novoteusers.includes(cmd.user.id)
 ) {
  client.util.errorCmd(cmd, lan.cannotVote, language);
  return;
 }

 const suggestion = await client.util.DataBase.suggestionvotes.findUnique({
  where: { msgid: cmd.message.id },
  select: { upvoted: true, downvoted: true },
 });
 if (!suggestion) {
  client.util.errorCmd(cmd, lan.notFound, language);
  return;
 }

 const data = updateVote(suggestion, cmd.user.id, up);

 const updatedSuggestion = await client.util.DataBase.suggestionvotes.update({
  where: { msgid: cmd.message.id },
  data,
  select: { upvoted: true, downvoted: true },
 });

 const embed = structuredClone(cmd.message.embeds[0]).data as Discord.APIEmbed;
 embed.fields = [
  {
   name: lan.votes,
   value: `${client.util.constants.standard.getEmote(client.util.emotes.tickWithBackground)}: ${
    updatedSuggestion.upvoted.length
   }\n${client.util.constants.standard.getEmote(client.util.emotes.crossWithBackground)}: ${
    updatedSuggestion.downvoted.length
   }`,
  },
 ];

 cmd.update({ embeds: [embed] });
};

export const isValid = async (cmd: Discord.ButtonInteraction<'cached'>) => {
 const language = await client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.suggest;
 const settings = await client.util.DataBase.suggestionsettings.findUnique({
  where: { guildid: cmd.guildId, active: true },
 });
 if (!settings) {
  client.util.errorCmd(cmd, lan.notEnabled, language);
  return false;
 }

 return { language, lan, settings };
};

const updateVote = (
 suggestion: { upvoted: string[]; downvoted: string[] },
 userid: string,
 upvote: boolean,
): Parameters<(typeof client.util)['DataBase']['suggestionvotes']['update']>[0]['data'] => {
 switch (true) {
  case suggestion.upvoted.includes(userid) && !upvote:
   return {
    upvoted: { set: suggestion.upvoted.filter((c) => c !== userid) },
    downvoted: { push: userid },
   };
  case suggestion.upvoted.includes(userid) && upvote:
   return {
    upvoted: { set: suggestion.upvoted.filter((c) => c !== userid) },
   };
  case suggestion.downvoted.includes(userid) && upvote:
   return {
    downvoted: { set: suggestion.downvoted.filter((c) => c !== userid) },
    upvoted: { push: userid },
   };
  case suggestion.downvoted.includes(userid) && !upvote:
   return {
    downvoted: { set: suggestion.downvoted.filter((c) => c !== userid) },
   };
  case upvote: {
   return { upvoted: { push: userid } };
  }
  case !upvote: {
   return { downvoted: { push: userid } };
  }
  default: {
   return {};
  }
 }
};
