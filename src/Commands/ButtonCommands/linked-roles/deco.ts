import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';
import { AllNonThreadGuildChannelTypes } from '../../../Typings/Channel.js';

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
    description: lan.apply.desc(
     settings.roleId ? (cmd.guild.roles.cache.get(settings.roleId)?.name ?? '') : '',
    ),
   },
  ],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.ChannelSelect,
      placeholder: language.t.Channels,
      custom_id: `linked-roles/deco_${settingsId}`,
      max_values: 25,
      min_values: 1,
      channel_types: [...AllNonThreadGuildChannelTypes, Discord.ChannelType.GuildCategory],
     },
    ],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      label: lan.apply.all,
      custom_id: `linked-roles/deco-all_${settingsId}`,
      style: Discord.ButtonStyle.Success,
     },
    ],
   },
  ],
 });
};
