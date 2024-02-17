import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (cmd: Discord.ButtonInteraction<'cached'>) => {
 const language = await cmd.client.util.getLanguage(cmd.guildId);

 cmd.client.util.replyCmd(cmd, {
  embeds: [
   {
    color: CT.Colors.Base,
    description: language.events.guildMemberAdd.thanks4Adding.mod,
   },
  ],
 });
};
