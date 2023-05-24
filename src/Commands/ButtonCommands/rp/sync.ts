import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import client from '../../../BaseClient/Client.js';
import { getComponents } from '../../SlashCommands/rp.js';

export default async (cmd: Discord.ButtonInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const user = await ch.query(`SELECT * FROM users WHERE userid = $1;`, [cmd.user.id], {
  returnType: 'users',
  asArray: false,
 });

 const language = await ch.languageSelector(cmd.guildId);
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

 const perms = await rpCmd.permissions.fetch({ guild: cmd.guild }).catch(() => []);

 const resolved: boolean[] = [];
 const promises = (await cmd.guild.commands.fetch()).map((c) =>
  c.permissions.set({ permissions: perms, token: user.accesstoken as string }).then(() => {
   resolved.push(true);
  }),
 );

 const guildsettings = await ch.query(
  `UPDATE guildsettings SET lastrpsyncrun = $1 WHERE guildid = $2 RETURNING *;`,
  [Date.now(), cmd.guildId],
  {
   returnType: 'guildsettings',
   asArray: false,
  },
 );

 await cmd.update({
  components: getComponents(language, lan, cmd, guildsettings),
 });

 const embed: Discord.APIEmbed = {
  color: ch.constants.colors.loading,
  author: {
   name: lan.syncing,
   icon_url: ch.objectEmotes.loading.link,
  },
 };

 const message = await cmd.followUp({
  ephemeral: true,
  embeds: [embed],
 });

 const interval = setInterval(() => {
  embed.description = `${lan.synced} ${resolved.length}/${cmd.guild.commands.cache.size}`;

  if (promises.length === resolved.length) {
   embed.color = ch.constants.colors.success;
   embed.author = {
    name: lan.synced,
    icon_url: ch.objectEmotes.tick.link,
   };
   embed.description = `${lan.synced} ${resolved.length}/${cmd.guild.commands.cache.size}`;
   clearInterval(interval);
  }

  if (message) message.edit({ embeds: [embed] });
  else clearInterval(interval);
 }, 5000);
};
