import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (cmd: Discord.ButtonInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.suggest;
 const settings = await cmd.client.util.DataBase.suggestionsettings.findUnique({
  where: { guildid: cmd.guildId, active: true },
 });
 if (!settings) {
  cmd.client.util.errorCmd(cmd, lan.notEnabled, language);
  return;
 }

 if (settings.anonvote) {
  cmd.client.util.errorCmd(cmd, lan.anonVote, language);
  return;
 }

 const suggestion = await cmd.client.util.DataBase.suggestionvotes.findUnique({
  where: { msgid: cmd.message.id },
 });

 cmd.client.util.replyCmd(cmd, {
  embeds: [
   {
    color: CT.Colors.Success,
    author: {
     name: lan.upvotes,
     icon_url: cmd.client.util.emotes.tickWithBackground.link,
    },
    description: (suggestion?.upvoted ?? []).map((u) => `<@${u}>`).join(', '),
   },
   {
    color: CT.Colors.Danger,
    author: {
     name: lan.downvotes,
     icon_url: cmd.client.util.emotes.crossWithBackground.link,
    },
    description: (suggestion?.downvoted ?? []).map((u) => `<@${u}>`).join(', '),
   },
  ],
 });
};
