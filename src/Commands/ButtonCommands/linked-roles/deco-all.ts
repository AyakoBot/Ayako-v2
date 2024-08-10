import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';
import { AllNonThreadGuildChannelTypes } from '../../../Typings/Channel.js';
import { canEditPermissionOverwrite } from '../../../BaseClient/UtilModules/requestHandler/channels/editPermissionOverwrite.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.settings.categories['linked-roles-deco'];

 const settingsId = args.pop() as string;
 if (!settingsId) return;

 const settings = await cmd.client.util.DataBase.linkedRolesDeco.findUnique({
  where: { uniquetimestamp: settingsId },
 });
 if (!settings) {
  cmd.client.util.errorCmd(cmd, language.errors.settingNotFound, language);
  return;
 }

 updateChannels(cmd.guild, settings.roleId);

 const embed = await cmd.client.util.settingsHelpers.changeHelpers.changeEmbed(
  language,
  CT.SettingNames.LinkedRolesDeco,
  'botId',
  '',
  CT.EditorTypes.User,
  cmd.guild,
 );

 cmd.update({
  embeds: [
   {
    author: embed.author,
    color: embed.color,
    description: lan.apply.applied,
   },
  ],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     cmd.client.util.settingsHelpers.buttonParsers.back(
      CT.SettingNames.LinkedRolesDeco,
      settingsId,
     ),
    ],
   },
  ],
 });
};

export const updateChannels = async (
 guild: Discord.Guild,
 roleId: string | null,
 channels?: Discord.GuildBasedChannel[],
) => {
 if (!roleId) return;

 const me = await guild.client.util.getBotMemberFromGuild(guild);

 const editChannels = (channels?.length ? channels : guild.channels.cache.map((c) => c)).filter(
  (c) =>
   [...AllNonThreadGuildChannelTypes, Discord.ChannelType.GuildCategory].includes(c.type) &&
   'permissionOverwrites' in c &&
   !c.permissionOverwrites.cache.has(roleId) &&
   ('permissionsLocked' in c ? !c.permissionsLocked : true) &&
   canEditPermissionOverwrite(c.id, { type: Discord.OverwriteType.Role, allow: '0' }, roleId, me),
  true,
 );

 editChannels.forEach((c) => {
  guild.client.util.request.channels.editPermissionOverwrite(c, roleId, {
   type: Discord.OverwriteType.Role,
   allow: '0',
  });
 });
};
