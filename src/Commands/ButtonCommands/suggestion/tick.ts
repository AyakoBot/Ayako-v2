import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ButtonInteraction, _args: string[], up = true) => {
 if (!cmd.inCachedGuild()) return;

 const valid = await isValid(cmd);
 if (!valid) return;
 const { language, lan, settings } = valid;

 if (
  settings.novoteroles.some((r) => cmd.member.roles.cache.has(r)) ||
  settings.novoteusers.includes(cmd.user.id)
 ) {
  ch.errorCmd(cmd, lan.cannotVote, language);
  return;
 }

 const suggestion = await ch.DataBase.suggestionvotes.findUnique({
  where: { msgid: cmd.message.id },
  select: { upvoted: true, downvoted: true },
 });
 if (!suggestion) {
  ch.errorCmd(cmd, lan.notFound, language);
  return;
 }

 const data = updateVote(suggestion, cmd.user.id, up);

 const updatedSuggestion = await ch.DataBase.suggestionvotes.update({
  where: { msgid: cmd.message.id },
  data,
  select: { upvoted: true, downvoted: true },
 });

 const embed = structuredClone(cmd.message.embeds[0]).data as Discord.APIEmbed;
 embed.fields = [
  {
   name: lan.votes,
   value: `${ch.constants.standard.getEmote(ch.emotes.tickWithBackground)}: ${
    updatedSuggestion.upvoted.length
   }\n${ch.constants.standard.getEmote(ch.emotes.crossWithBackground)}: ${
    updatedSuggestion.downvoted.length
   }`,
  },
 ];

 cmd.update({ embeds: [embed] });
};

export const isValid = async (cmd: Discord.ButtonInteraction<'cached'>) => {
 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.suggest;
 const settings = await ch.DataBase.suggestionsettings.findUnique({
  where: { guildid: cmd.guildId, active: true },
 });
 if (!settings) {
  ch.errorCmd(cmd, lan.notEnabled, language);
  return false;
 }

 return { language, lan, settings };
};

const updateVote = (
 suggestion: { upvoted: string[]; downvoted: string[] },
 userid: string,
 upvote: boolean,
): Parameters<(typeof ch)['DataBase']['suggestionvotes']['update']>[0]['data'] => {
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
