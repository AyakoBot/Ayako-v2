import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;
 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.info.role;

 const role = cmd.options.getRole('role-mention', true);
 const members = await cmd.guild.members.fetch().catch(() => undefined);

 ch.replyCmd(cmd, {
  embeds: [
   {
    author: {
     name: lan.author,
    },
    color: ch.colorSelector(cmd.guild?.members.me),
    description: {

    }
   },
  ],
 });
};
