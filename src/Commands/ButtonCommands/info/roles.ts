import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import { request } from '../../../BaseClient/ClientHelperModules/requestHandler.js';
import { GuildMember } from '../../../BaseClient/Other/classes.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.languageSelector(cmd.guildId);
 const rawMember = await request.guilds.getMember(cmd.guild, args.shift() ?? cmd.user.id);
 if ('message' in rawMember) {
  ch.errorCmd(cmd, rawMember.message, language);
  return;
 }

 const member = new GuildMember(cmd.client, rawMember, cmd.guild);
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
