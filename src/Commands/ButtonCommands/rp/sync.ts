import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';
import { getComponents } from '../../SlashCommands/rp/manager.js';

export default async (cmd: Discord.ButtonInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.rp;

 const guildSettings = await cmd.client.util.DataBase.guildsettings.findUnique({
  where: { guildid: cmd.guildId },
  select: { lastrpsyncrun: true },
 });
 if (Number(guildSettings?.lastrpsyncrun) > Date.now() - 3600000) {
  cmd.client.util.errorCmd(
   cmd,
   lan.syncRunning((await cmd.client.util.getCustomCommand(cmd.guild, 'rp'))?.id ?? '0'),
   language,
  );
  return;
 }

 const customClient = await cmd.client.util.DataBase.customclients.findUnique({
  where: { guildid: cmd.guildId },
 });
 const tokens = await cmd.client.util.DataBase.tokens.findUnique({
  where: {
   userid_botid: { userid: cmd.user.id, botid: customClient?.appid ?? process.env.mainId ?? '' },
  },
 });

 if (!tokens) {
  cmd.client.util.errorCmd(cmd, language.errors.notLoggedIn, language);
  return;
 }

 if (!tokens.scopes.includes(Discord.OAuth2Scopes.ApplicationCommandsPermissionsUpdate)) {
  cmd.client.util.errorCmd(cmd, lan.badScopes, language);
  return;
 }

 if (Number(tokens.expires) < Date.now()) {
  tokens.accesstoken = await cmd.client.util.refreshToken(tokens.refreshtoken ?? '');
 }
 if (!tokens.accesstoken) {
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
    tokens.accesstoken ?? '',
    c.id,
    { permissions: perms },
   ),
  );

 const guildsettings = await cmd.client.util.DataBase.$transaction([
  cmd.client.util.DataBase.guildsettings.upsert({
   where: { guildid: cmd.guildId },
   update: { lastrpsyncrun: Date.now() },
   create: { guildid: cmd.guildId, lastrpsyncrun: Date.now() },
  }),
  cmd.client.util.DataBase.customclients.findUnique({
   where: { guildid: cmd.guildId },
   select: { appid: true },
  }),
 ]).then(([g, c]) => ({ ...g, appid: c?.appid ?? null }));

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
