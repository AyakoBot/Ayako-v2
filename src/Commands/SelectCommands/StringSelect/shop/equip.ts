import * as Discord from 'discord.js';
import shopCmd from '../../../SlashCommands/shop.js';

export default async (cmd: Discord.StringSelectMenuInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const id = cmd.values[0];
 if (!id) {
  cmd.client.util.error(cmd.guild, new Error('No ID found'));
  return;
 }

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.roles.shop;

 const shop = await cmd.client.util.DataBase.shop.findUnique({
  where: { guildid: cmd.guildId, active: true },
 });
 if (!shop) {
  cmd.client.util.errorCmd(cmd, lan.notEnabled, language);
  return;
 }

 const shopitem = await cmd.client.util.DataBase.shopitems.findUnique({
  where: { uniquetimestamp: id, active: true },
 });
 if (!shopitem) {
  cmd.client.util.errorCmd(cmd, lan.notEnabled, language);
  return;
 }

 const shopuser = await cmd.client.util.DataBase.shopusers.findUnique({
  where: { userid_guildid: { guildid: cmd.guildId, userid: cmd.user.id } },
 });
 if (!shopuser) {
  cmd.client.util.errorCmd(cmd, lan.notBought, language);
  return;
 }

 const roles = cmd.member.roles.cache.hasAll(...shopitem.roles)
  ? cmd.member.roles.cache.map((r) => r.id).filter((r) => !shopitem.roles.includes(r))
  : [...cmd.member.roles.cache.map((r) => r.id), ...shopitem.roles];

 await cmd.client.util.request.guilds.editMember(cmd.member, { roles }, language.autotypes.shop);

 shopCmd(cmd);
};
