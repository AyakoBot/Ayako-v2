import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import shopCmd from '../../../SlashCommands/shop.js';

export default async (cmd: Discord.StringSelectMenuInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const id = cmd.values[0];
 if (!id) {
  ch.error(cmd.guild, new Error('No ID found'));
  return;
 }

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.roles.shop;

 const shop = await ch.DataBase.shop.findUnique({
  where: { guildid: cmd.guildId, active: true },
 });
 if (!shop) {
  ch.errorCmd(cmd, lan.notEnabled, language);
  return;
 }

 const shopitem = await ch.DataBase.shopitems.findUnique({
  where: { uniquetimestamp: id, active: true },
 });
 if (!shopitem) {
  ch.errorCmd(cmd, lan.notEnabled, language);
  return;
 }

 const shopuser = await ch.DataBase.shopusers.findUnique({
  where: { userid_guildid: { guildid: cmd.guildId, userid: cmd.user.id } },
 });
 if (!shopuser) {
  ch.errorCmd(cmd, lan.notBought, language);
  return;
 }

 const roles = cmd.member.roles.cache.hasAll(...shopitem.roles)
  ? cmd.member.roles.cache.map((r) => r.id).filter((r) => !shopitem.roles.includes(r))
  : [...cmd.member.roles.cache.map((r) => r.id), ...shopitem.roles];

 await ch.request.guilds.editMember(cmd.guild, cmd.user.id, { roles }, language.autotypes.shop);

 shopCmd(cmd);
};
