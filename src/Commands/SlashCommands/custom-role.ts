import * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';
import { getContent } from '../../Events/autoModerationActionEvents/censor.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.roles.customRole;

 const settings = await ch.DataBase.rolerewards.findMany({
  where: { guildid: cmd.guildId, active: true, customrole: true },
 });
 if (!settings.length) {
  ch.errorCmd(cmd, language.slashCommands.roles.customRole.notEnabled, language);
  return;
 }

 const applyingSettings = settings.filter(
  (s) =>
   s.roles.some((r) => cmd.member.roles.cache.has(r)) &&
   !s.blroleid.some((r) => cmd.member.roles.cache.has(r)) &&
   !s.bluserid.includes(cmd.user.id),
 );

 if (!applyingSettings.length) {
  ch.errorCmd(cmd, language.slashCommands.roles.customRole.cantSet, language);
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
   ch.errorCmd(cmd, e as Error, await ch.getLanguage(cmd.guildId));
   return;
  }
 }

 const customroleSetting = await ch.DataBase.customroles.findUnique({
  where: {
   guildid_userid: {
    guildid: cmd.guildId,
    userid: cmd.user.id,
   },
  },
 });
 const customRole = customroleSetting ? cmd.guild.roles.cache.get(customroleSetting.roleid) : false;

 if (customRole) {
  const role = await ch.request.guilds.editRole(cmd.guild, customRole.id, {
   name: name ? await getContent(cmd.guild, name) : undefined,
   unicode_emoji: !emoji || emoji.id ? undefined : emoji.name,
   color: parsedColor ?? undefined,
   icon:
    parsedIcon && cmd.guild.features.includes(Discord.GuildFeature.RoleIcons)
     ? parsedIcon
     : undefined,
  });

  if ('message' in role) {
   ch.errorCmd(
    cmd,
    role.message.includes('ENOENT') ? language.errors.emoteNotFound : role,
    language,
   );
   return;
  }

  ch.replyCmd(cmd, { content: lan.edit(role, { icon: canseticon, color: cansetcolor }) });
  return;
 }

 const role = await ch.request.guilds.createRole(
  cmd.guild,
  {
   name: name ?? cmd.member.displayName,
   unicode_emoji: !emoji || emoji.id ? undefined : emoji.name,
   color: parsedColor,
   icon:
    parsedIcon && cmd.guild.features.includes(Discord.GuildFeature.RoleIcons)
     ? parsedIcon
     : undefined,
  },
  cmd.user.username,
 );

 if ('message' in role) {
  ch.errorCmd(
   cmd,
   role.message.includes('ENOENT') ? language.errors.emoteNotFound : role,
   language,
  );
  return;
 }

 ch.roleManager.add(
  cmd.member,
  [role.id],
  language.events.guildMemberUpdate.rewards.customRoleName,
 );
 ch.replyCmd(cmd, { content: lan.create(role, { icon: canseticon, color: cansetcolor }) });

 ch.DataBase.customroles
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
  await ch.request.guilds.setRolePositions(cmd.guild, [
   {
    position: positionRole.rawPosition,
    id: role.id,
   },
  ]);
 }
};
