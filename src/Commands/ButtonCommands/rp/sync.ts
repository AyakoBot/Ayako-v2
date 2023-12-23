import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import client from '../../../BaseClient/Client.js';
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

 const rpCmd = (await client.application?.commands.fetch())?.find((c) => c.name === 'rp');
 if (!rpCmd) {
  ch.error(cmd.guild, new Error('RP Command not found'));
  return;
 }

 const perms = (await ch.cache.commandPermissions.get(cmd.guild, rpCmd.id)) ?? [];
 const resolved: boolean[] = [];
 const promises = (await cmd.guild.commands.fetch()).map((c) =>
  ch.request.commands
   .editGuildCommandPermissions(c.guild as Discord.Guild, user.accesstoken as string, c.id, {
    permissions: perms,
   })
   .then(() => {
    resolved.push(true);
   }),
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
  author: {
   name: lan.syncing,
   icon_url: ch.emotes.loading.link,
  },
 };

 const message = await cmd.followUp({
  ephemeral: true,
  embeds: [embed],
 });

 const job = Jobs.scheduleJob('*/10 * * * * *', () => {
  embed.description = `${lan.synced} ${resolved.length}/${cmd.guild.commands.cache.size}`;

  if (promises.length === resolved.length) {
   embed.color = CT.Colors.Success;
   embed.author = {
    name: lan.synced,
    icon_url: ch.emotes.tick.link,
   };
   embed.description = `${lan.synced} ${resolved.length}/${cmd.guild.commands.cache.size}`;
   job.cancel();
  }

  if (message) cmd.editReply({ embeds: [embed], message });
  else job.cancel();
 });
};
