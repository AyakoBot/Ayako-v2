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
 const color = cmd.options.getString('color', false);
 const color2 = cmd.options.getString('color-2', false);

 if (!color) {
  cmd.client.util.errorCmd(cmd, language.errors.noArguments, language);
  return;
 }

 if (color && !color.match(/[0-9a-f]+/i)?.length) {
  cmd.client.util.errorCmd(cmd, language.errors.invalidColor, language);
  return;
 }

 if (color2 && !color2.match(/[0-9a-f]+/i)?.length) {
  cmd.client.util.errorCmd(cmd, language.errors.invalidColor, language);
  return;
 }

 const parsedColor1 = color
  ? cmd.client.util.getColor(color.startsWith('#') ? color : `#${color}`)
  : undefined;

 const parsedColor2 = color2
  ? cmd.client.util.getColor(color2.startsWith('#') ? color2 : `#${color2}`)
  : undefined;

 const res = await cmd.client.util.request.guilds.editRole(
  cmd.guild,
  role.id,
  // TODO: wait for djs to document this
  {
   colors: {
    primary_color: parsedColor1 ?? undefined,
    secondary_color: parsedColor2 ?? undefined,
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
