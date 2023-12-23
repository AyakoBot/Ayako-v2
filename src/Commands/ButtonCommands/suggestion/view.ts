import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/Typings.js';

export default async (cmd: Discord.ButtonInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.suggest;
 const settings = await ch.DataBase.suggestionsettings.findUnique({
  where: { guildid: cmd.guildId, active: true },
 });
 if (!settings) {
  ch.errorCmd(cmd, lan.notEnabled, language);
  return;
 }

 if (settings.anonvote) {
  ch.errorCmd(cmd, lan.anonVote, language);
  return;
 }

 const suggestion = await ch.DataBase.suggestionvotes.findUnique({
  where: { msgid: cmd.message.id },
 });

 ch.replyCmd(cmd, {
  embeds: [
   {
    color: CT.Colors.Success,
    author: {
     name: lan.upvotes,
     icon_url: ch.emotes.tickWithBackground.link,
    },
    description: (suggestion?.upvoted ?? []).map((u) => `<@${u}>`).join(', '),
   },
   {
    color: CT.Colors.Danger,
    author: {
     name: lan.downvotes,
     icon_url: ch.emotes.crossWithBackground.link,
    },
    description: (suggestion?.downvoted ?? []).map((u) => `<@${u}>`).join(', '),
   },
  ],
 });
};
