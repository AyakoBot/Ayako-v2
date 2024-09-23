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

 const user = await cmd.client.util.DataBase.balance.update({
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
  cmd.client.util.errorCmd(
   cmd,
   lan.notEnoughMoney(
    cmd.client.util.constants.standard.getEmote(
     shop.currencyemote
      ? (Discord.parseEmoji(shop.currencyemote) ?? cmd.client.util.emotes.book)
      : cmd.client.util.emotes.book,
    ) ?? '💶',
   ),
   language,
  );
  return;
 }

 const shopuser = await cmd.client.util.DataBase.shopusers.upsert({
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
  cmd.client.util.errorCmd(cmd, lan.alreadyBought, language);
  return;
 }

 if (!cmd.member.roles.cache.hasAll(...shopitem.roles)) {
  await cmd.client.util.request.guilds.editMember(
   cmd.member,
   {
    roles: [...cmd.member.roles.cache.map((r) => r.id), ...shopitem.roles],
   },
   language.autotypes.shop,
  );
 }

 shopCmd(cmd);
};
