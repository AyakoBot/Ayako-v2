import * as Discord from 'discord.js';
import { getContent } from '../../Events/BotEvents/autoModerationActionEvents/censor.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.roles.customRole;

 const settings = await cmd.client.util.DataBase.rolerewards.findMany({
  where: { guildid: cmd.guildId, active: true, customrole: true },
 });
 if (!settings.length) {
  cmd.client.util.errorCmd(cmd, language.slashCommands.roles.customRole.notEnabled, language);
  return;
 }

 const applyingSettings = settings.filter(
  (s) =>
   s.roles.some((r) => cmd.member.roles.cache.has(r)) &&
   !s.blroleid.some((r) => cmd.member.roles.cache.has(r)) &&
   !s.bluserid.includes(cmd.user.id),
 );

 if (!applyingSettings.length) {
  cmd.client.util.errorCmd(cmd, language.slashCommands.roles.customRole.cantSet, language);
  return;
 }

 const cansetcolor = applyingSettings.some((s) => s.cansetcolor);
 const canseticon = applyingSettings.some((s) => s.canseticon);
 const positionRoleId = applyingSettings.find((s) => s.positionrole)?.positionrole;

 const name = cmd.options.getString('name', false);
 const color = cansetcolor ? cmd.options.getString('color', false) : undefined;
 const colorRole = cansetcolor ? cmd.options.getRole('color-role', false) : undefined;
 const icon = canseticon ? cmd.options.getAttachment('icon', false) : undefined;
 const iconEmoji = canseticon ? cmd.options.getString('icon-emoji', false) : undefined;
 const iconUrl = canseticon ? cmd.options.getString('icon-url', false) : undefined;

 const parsedIcon =
  iconUrl ??
  icon?.url ??
  (iconEmoji && Discord.parseEmoji(iconEmoji)?.id
   ? `https://cdn.discordapp.com/emojis/${Discord.parseEmoji(iconEmoji)?.id}.png`
   : undefined);

 const emoji = iconEmoji ? Discord.parseEmoji(iconEmoji) : undefined;
 const parsedColor = colorRole?.color || (color ? parseInt(color, 16) : undefined);

 if (iconUrl) {
  try {
   new URL(iconUrl);
  } catch (e) {
   cmd.client.util.errorCmd(cmd, e as Error, await cmd.client.util.getLanguage(cmd.guildId));
   return;
  }
 }

 const customroleSetting = await cmd.client.util.DataBase.customroles.findUnique({
  where: {
   guildid_userid: {
    guildid: cmd.guildId,
    userid: cmd.user.id,
   },
  },
 });
 const customRole = customroleSetting ? cmd.guild.roles.cache.get(customroleSetting.roleid) : false;

 if (customRole) {
  const role = await cmd.client.util.request.guilds.editRole(cmd.guild, customRole.id, {
   name: name ? await getContent(cmd.guild, name) : undefined,
   unicode_emoji: !emoji || emoji.id ? undefined : emoji.name,
   color: parsedColor ?? undefined,
   icon:
    parsedIcon && cmd.guild.features.includes(Discord.GuildFeature.RoleIcons)
     ? parsedIcon
     : undefined,
  });

  if ('message' in role) {
   cmd.client.util.errorCmd(
    cmd,
    role.message.includes('ENOENT') ? language.errors.emoteNotFound : role,
    language,
   );
   return;
  }

  cmd.client.util.replyCmd(cmd, {
   content: lan.edit(role, { icon: canseticon, color: cansetcolor }),
  });

  cmd.client.util.roleManager.add(
   cmd.member,
   [role.id],
   language.events.guildMemberUpdate.rewards.customRoleName,
  );
  return;
 }

 const role = await cmd.client.util.request.guilds.createRole(
  cmd.guild,
  {
   name: name ?? cmd.member.displayName,
   unicode_emoji: !emoji || emoji.id ? undefined : emoji.name,
   color: parsedColor,
   icon:
    parsedIcon && cmd.guild.features.includes(Discord.GuildFeature.RoleIcons)
     ? parsedIcon
     : undefined,
   permissions: '0',
  },
  cmd.user.username,
 );

 if ('message' in role) {
  cmd.client.util.errorCmd(
   cmd,
   role.message.includes('ENOENT') ? language.errors.emoteNotFound : role,
   language,
  );
  return;
 }

 cmd.client.util.roleManager.add(
  cmd.member,
  [role.id],
  language.events.guildMemberUpdate.rewards.customRoleName,
 );
 cmd.client.util.replyCmd(cmd, {
  content: lan.create(role, { icon: canseticon, color: cansetcolor }),
 });

 cmd.client.util.DataBase.customroles
  .create({
   data: {
    userid: cmd.user.id,
    roleid: role.id,
    guildid: cmd.guildId,
   },
  })
  .then();

 const positionRole = positionRoleId ? cmd.guild.roles.cache.get(positionRoleId) : undefined;
 if (positionRole) {
  await cmd.client.util.request.guilds.setRolePositions(cmd.guild, [
   {
    position: positionRole.rawPosition,
    id: role.id,
   },
  ]);
 }
};
