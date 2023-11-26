import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const type = args.shift() as 'member' | 'server';

 const guildOrMember =
  type === 'member'
   ? await ch.request.guilds.getMember(cmd.guild, args.shift() ?? cmd.user.id)
   : cmd.guild;
 if ('message' in guildOrMember) {
  ch.errorCmd(cmd, guildOrMember, language);
  return;
 }

 cmd.reply({
  embeds: [
   {
    description: `**${language.t.Roles}**:\n${guildOrMember.roles.cache
     .sort((a, b) => b.rawPosition - a.rawPosition)
     .map((r) => `${r}`)
     .join('\n')}`,
    color: ch.constants.colors.ephemeral,
   },
  ],
  ephemeral: true,
 });
};
