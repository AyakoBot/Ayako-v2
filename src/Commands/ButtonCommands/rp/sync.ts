import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/Typings.js';
import { getComponents } from '../../SlashCommands/rp/manager.js';

export default async (cmd: Discord.ButtonInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const user = await ch.DataBase.users.findUnique({ where: { userid: cmd.user.id } });
 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.rp;

 if (!user?.refreshtoken || !user?.accesstoken || !user?.expires) {
  ch.errorCmd(cmd, language.errors.notLoggedIn, language);
  return;
 }

 if (Number(user.expires) < Date.now()) user.accesstoken = await ch.refreshToken(user.refreshtoken);
 if (!user.accesstoken) {
  ch.errorCmd(cmd, language.errors.notLoggedIn, language);
  return;
 }

 const rpCmd = await ch.getCustomCommand(cmd.guild, 'rp');
 if (!rpCmd) {
  ch.error(cmd.guild, new Error('RP Command not found'));
  return;
 }

 const perms = (await ch.cache.commandPermissions.get(cmd.guild, rpCmd.id)) ?? [];
 [...(ch.cache.commands.cache.get(cmd.guildId)?.values() ?? [])].map((c) =>
  ch.request.commands.editGuildCommandPermissions(
   cmd.guild as Discord.Guild,
   user.accesstoken as string,
   c.id,
   { permissions: perms },
  ),
 );

 const guildsettings = await ch.DataBase.guildsettings.update({
  where: { guildid: cmd.guildId },
  data: { lastrpsyncrun: Date.now() },
 });

 await cmd.update({
  components: getComponents(language, lan, cmd, guildsettings),
 });

 const embed: Discord.APIEmbed = {
  color: CT.Colors.Loading,
  description: lan.willTake(ch.constants.standard.getTime(Date.now() + 3600000)),
  author: {
   name: lan.syncing,
   icon_url: ch.emotes.loading.link,
  },
 };

 await cmd.followUp({
  ephemeral: true,
  embeds: [embed],
 });
};
