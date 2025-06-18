import * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.roles;

 if (!cmd.guild.features.includes('ENHANCED_ROLE_COLORS')) {
  cmd.client.util.errorCmd(
   cmd,
   language.slashCommands.roles.customRole.gradientsNotAvailable,
   language,
  );
  return;
 }

 const role = cmd.options.getRole('role', true);

 const res = await cmd.client.util.request.guilds.editRole(
  cmd.guild,
  role.id,
  // TODO: wait for djs to document this
  {
   colors: {
    primary_color: 11127295,
    secondary_color: 16759788,
    tertiary_color: 16761760,
   },
  } as never,
  cmd.user.username,
 );

 if (!res || 'message' in res) {
  cmd.client.util.errorCmd(cmd, res.message, language);
  return;
 }

 cmd.client.util.replyCmd(cmd, { content: lan.edit(role) });
};
