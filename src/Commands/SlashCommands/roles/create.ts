import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const name = cmd.options.getString('name', true);
 let color = cmd.options.getString('color', false);
 const icon = cmd.options.getAttachment('icon', false);
 const positionRole = cmd.options.getRole('position-role', false);
 const permissionRole = cmd.options.getRole('permission-role', false);

 if (Number.isNaN(parseInt(color as string, 16))) color = null;

 let error: Error | null = null;
 const role = await cmd.guild.roles
  .create({
   name,
   color: color ? parseInt(color, 16) : undefined,
   icon: icon?.url,
   position: positionRole?.position,
   permissions: permissionRole?.permissions,
  })
  .catch((e) => {
   error = e;
  });

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.roles;

 if (error) ch.errorCmd(cmd, (error as Error).message, language);
 else ch.replyCmd(cmd, { content: lan.create(role as Discord.Role) });
};
