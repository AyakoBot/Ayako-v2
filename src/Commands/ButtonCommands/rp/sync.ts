import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';
import { getComponents } from '../../SlashCommands/rp/manager.js';

export default async (cmd: Discord.ButtonInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const user = await cmd.client.util.DataBase.users.findUnique({ where: { userid: cmd.user.id } });
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.rp;

 if (!user?.refreshtoken || !user?.accesstoken || !user?.expires) {
  cmd.client.util.errorCmd(cmd, language.errors.notLoggedIn, language);
  return;
 }

 if (Number(user.expires) < Date.now()) {
  user.accesstoken = await cmd.client.util.refreshToken(user.refreshtoken);
 }
 if (!user.accesstoken) {
  cmd.client.util.errorCmd(cmd, language.errors.notLoggedIn, language);
  return;
 }

 const rpCmd = await cmd.client.util.getCustomCommand(cmd.guild, 'rp');
 if (!rpCmd) {
  cmd.client.util.error(cmd.guild, new Error('RP Command not found'));
  return;
 }

 const perms = (await cmd.client.util.cache.commandPermissions.get(cmd.guild, rpCmd.id)) ?? [];

 [...(cmd.client.util.cache.commands.cache.get(cmd.guildId)?.values() ?? [])]
  .filter((c) => !!cmd.client.util.constants.commands.interactions.find((c2) => c2.name === c.name))
  .map((c) =>
   cmd.client.util.request.commands.editGuildCommandPermissions(
    cmd.guild as Discord.Guild,
    user.accesstoken as string,
    c.id,
    { permissions: perms },
   ),
  );

 const guildsettings = await cmd.client.util.DataBase.guildsettings.update({
  where: { guildid: cmd.guildId },
  data: { lastrpsyncrun: Date.now() },
 });

 await cmd.update({
  components: getComponents(language, lan, cmd, guildsettings),
 });

 const embed: Discord.APIEmbed = {
  color: CT.Colors.Loading,
  description: lan.willTake(cmd.client.util.constants.standard.getTime(Date.now() + 3600000)),
  author: {
   name: lan.syncing,
   icon_url: cmd.client.util.emotes.loading.link,
  },
 };

 await cmd.followUp({
  ephemeral: true,
  embeds: [embed],
 });
};
