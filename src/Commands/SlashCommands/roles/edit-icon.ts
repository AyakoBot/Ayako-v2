import * as Discord from 'discord.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.roles;

 if (!cmd.guild.features.includes(Discord.GuildFeature.RoleIcons)) {
  cmd.client.util.errorCmd(
   cmd,
   language.slashCommands.roles.customRole.iconsNotAvailable,
   language,
  );
  return;
 }

 const role = cmd.options.getRole('role', true);
 const icon = cmd.options.getAttachment('icon', false);
 const iconEmoji = cmd.options.getString('icon-emoji', false);
 const iconUrl = cmd.options.getString('icon-url', false);

 if (!icon && !iconEmoji && !iconUrl) {
  cmd.client.util.errorCmd(cmd, language.errors.noArguments, language);
  return;
 }

 const parsedIcon =
  iconUrl ??
  icon?.url ??
  (iconEmoji && Discord.parseEmoji(iconEmoji)?.id
   ? `https://cdn.discordapp.com/emojis/${Discord.parseEmoji(iconEmoji)?.id}.png`
   : undefined);

 const emoji = iconEmoji ? Discord.parseEmoji(iconEmoji) : undefined;

 if (iconUrl) {
  try {
   new URL(iconUrl);
  } catch (e) {
   cmd.client.util.errorCmd(cmd, e as Error, await cmd.client.util.getLanguage(cmd.guildId));
   return;
  }
 }

 const res = await cmd.client.util.request.guilds.editRole(
  cmd.guild,
  role.id,
  {
   unicode_emoji: !emoji || emoji.id ? undefined : emoji.name,
   icon:
    parsedIcon && cmd.guild.features.includes(Discord.GuildFeature.RoleIcons)
     ? parsedIcon
     : undefined,
  },
  cmd.user.username,
 );

 if (!res || 'message' in res) {
  cmd.client.util.errorCmd(
   cmd,
   res.message.includes('ENOENT') ? language.errors.emoteNotFound : res.message,
   language,
  );
  return;
 }

 cmd.client.util.replyCmd(cmd, { content: lan.edit(role) });
};
