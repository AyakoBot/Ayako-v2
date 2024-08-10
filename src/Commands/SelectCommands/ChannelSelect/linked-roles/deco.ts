import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';
import { updateChannels } from '../../../ButtonCommands/linked-roles/deco-all.js';

export default async (cmd: Discord.ChannelSelectMenuInteraction, args: string[]) => {
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

 updateChannels(
  cmd.guild,
  settings.roleId,
  cmd.channels
   .map((c) => c)
   .filter((c): c is Discord.GuildBasedChannel => !c.isDMBased() && !c.isThread()),
 );

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
