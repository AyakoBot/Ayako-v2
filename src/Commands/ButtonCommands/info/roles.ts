import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.languageSelector(cmd.guildId);
 const member = await cmd.guild?.members.fetch(args.shift() ?? cmd.user.id).catch(() => undefined);

 if (!member) {
  ch.errorCmd(cmd, language.errors.memberNotFound, language);
  return;
 }

 cmd.reply({
  embeds: [
   {
    description: `**${language.roles}**:\n${member.roles.cache
     .sort((a, b) => b.rawPosition - a.rawPosition)
     .map((r) => `${r}`)
     .join('\n')}`,
    color: ch.constants.colors.ephemeral,
   },
  ],
  ephemeral: true,
 });
};
