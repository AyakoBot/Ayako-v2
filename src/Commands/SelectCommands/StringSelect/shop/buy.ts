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

 const user = await ch.DataBase.balance.update({
  where: {
   userid_guildid: { guildid: cmd.guildId, userid: cmd.user.id },
   balance: { gte: Number(shopitem.price) },
  },
  data: {
   balance: { decrement: Number(shopitem.price) },
  },
  select: { balance: true },
 });

 if (!user) {
  ch.errorCmd(
   cmd,
   lan.notEnoughMoney(
    ch.constants.standard.getEmote(
     shop.currencyemote ? Discord.parseEmoji(shop.currencyemote) ?? ch.emotes.book : ch.emotes.book,
    ),
   ),
   language,
  );
  return;
 }

 const shopuser = await ch.DataBase.shopusers.upsert({
  where: {
   userid_guildid: { guildid: cmd.guildId, userid: cmd.user.id },
   NOT: { boughtids: { has: String(shopitem.uniquetimestamp) } },
  },
  create: {
   userid: cmd.user.id,
   guildid: cmd.guildId,
   boughtids: [String(shopitem.uniquetimestamp)],
  },
  update: {
   boughtids: { push: String(shopitem.uniquetimestamp) },
  },
  select: { boughtids: true },
 });

 if (!shopuser) {
  ch.errorCmd(cmd, lan.alreadyBought, language);
  return;
 }

 if (!cmd.member.roles.cache.hasAll(...shopitem.roles)) {
  await ch.request.guilds.editMember(
   cmd.member,
   {
    roles: [...cmd.member.roles.cache.map((r) => r.id), ...shopitem.roles],
   },
   language.autotypes.shop,
  );
 }

 shopCmd(cmd);
};
