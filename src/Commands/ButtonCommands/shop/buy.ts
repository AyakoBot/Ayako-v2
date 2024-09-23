import Prisma from '@prisma/client';
import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const id = args.shift();
 if (!id) {
  cmd.client.util.error(cmd.guild, new Error('No ID found'));
  return;
 }

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.roles.shop;

 const settings = await cmd.client.util.DataBase.shop.findUnique({
  where: { guildid: cmd.guildId, active: true },
 });
 if (!settings) {
  cmd.client.util.errorCmd(cmd, lan.notEnabled, language);
  return;
 }

 const shopitem = await cmd.client.util.DataBase.shopitems.findUnique({
  where: { uniquetimestamp: id, active: true, roles: { isEmpty: false } },
 });
 if (!shopitem) {
  cmd.client.util.errorCmd(cmd, lan.notEnabled, language);
  return;
 }

 const shopuser = await cmd.client.util.DataBase.shopusers.findUnique({
  where: { userid_guildid: { guildid: cmd.guildId, userid: cmd.user.id }, boughtids: { has: id } },
 });

 if (!shopuser) buy(cmd, settings, shopitem, language);
 else equip(cmd, shopitem, language);
};

const buy = async (
 cmd: Discord.ButtonInteraction<'cached'>,
 settings: Prisma.shop,
 shopitem: Prisma.shopitems,
 language: CT.Language,
) => {
 const balance = await cmd.client.util.DataBase.balance.update({
  where: {
   userid_guildid: { guildid: cmd.guildId, userid: cmd.user.id },
   balance: { gte: Number(shopitem.price) },
  },
  data: { balance: { decrement: Number(shopitem.price) } },
  select: { balance: true },
 });
 if (!balance) {
  cmd.client.util.errorCmd(
   cmd,
   language.slashCommands.roles.shop.notEnoughMoney(
    cmd.client.util.constants.standard.getEmote(
     settings.currencyemote
      ? (Discord.parseEmoji(settings.currencyemote) ?? cmd.client.util.emotes.book)
      : cmd.client.util.emotes.book,
    ) ?? '💶',
   ),
   language,
  );
  return;
 }

 cmd.client.util.DataBase.shopusers
  .upsert({
   where: {
    userid_guildid: { guildid: cmd.guildId, userid: cmd.user.id },
   },
   create: {
    userid: cmd.user.id,
    guildid: cmd.guildId,
    boughtids: [String(shopitem.uniquetimestamp)],
   },
   update: { boughtids: { push: String(shopitem.uniquetimestamp) } },
  })
  .then();

 cmd.client.util.request.guilds.editMember(
  cmd.member,
  {
   roles: [...cmd.member.roles.cache.map((r) => r.id), ...shopitem.roles],
  },
  language.autotypes.shop,
 );

 cmd.client.util.replyCmd(cmd, { content: language.slashCommands.roles.shop.bought });
};

const equip = async (
 cmd: Discord.ButtonInteraction<'cached'>,
 shopitem: Prisma.shopitems,
 language: CT.Language,
) => {
 const roles = cmd.member.roles.cache.hasAll(...shopitem.roles)
  ? cmd.member.roles.cache.map((r) => r.id).filter((r) => !shopitem.roles.includes(r))
  : [...cmd.member.roles.cache.map((r) => r.id), ...shopitem.roles];

 cmd.client.util.replyCmd(cmd, {
  content: cmd.member.roles.cache.hasAll(...shopitem.roles)
   ? language.slashCommands.roles.shop.unequipt
   : language.slashCommands.roles.shop.equipt,
 });

 cmd.client.util.request.guilds.editMember(cmd.member, { roles }, language.autotypes.shop);
};
