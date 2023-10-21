import Prisma from '@prisma/client';
import * as Discord from 'discord.js';
import * as CT from '../../../Typings/CustomTypings.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;

 const id = args.shift();
 if (!id) {
  ch.error(cmd.guild, new Error('No ID found'));
  return;
 }

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.roles.shop;

 const settings = await ch.DataBase.shop.findUnique({
  where: { guildid: cmd.guildId, active: true },
 });
 if (!settings) {
  ch.errorCmd(cmd, lan.notEnabled, language);
  return;
 }

 const shopitem = await ch.DataBase.shopitems.findUnique({
  where: { uniquetimestamp: id, active: true, roles: { isEmpty: false } },
 });
 if (!shopitem) {
  ch.errorCmd(cmd, lan.notEnabled, language);
  return;
 }

 const shopuser = await ch.DataBase.shopusers.findUnique({
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
 const balance = await ch.DataBase.balance.update({
  where: {
   userid_guildid: { guildid: cmd.guildId, userid: cmd.user.id },
   balance: { gte: Number(shopitem.price) },
  },
  data: { balance: { decrement: Number(shopitem.price) } },
  select: { balance: true },
 });
 if (!balance) {
  ch.errorCmd(
   cmd,
   language.slashCommands.roles.shop.notEnoughMoney(
    ch.constants.standard.getEmote(
     settings.currencyemote
      ? Discord.parseEmoji(settings.currencyemote) ?? ch.emotes.book
      : ch.emotes.book,
    ),
   ),
   language,
  );
  return;
 }

 ch.DataBase.shopusers
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

 ch.request.guilds.editMember(
  cmd.guild,
  cmd.user.id,
  {
   roles: [...cmd.member.roles.cache.map((r) => r.id), ...shopitem.roles],
  },
  language.autotypes.shop,
 );

 ch.replyCmd(cmd, { content: language.slashCommands.roles.shop.bought });
};

const equip = async (
 cmd: Discord.ButtonInteraction<'cached'>,
 shopitem: Prisma.shopitems,
 language: CT.Language,
) => {
 const roles = cmd.member.roles.cache.hasAll(...shopitem.roles)
  ? cmd.member.roles.cache.map((r) => r.id).filter((r) => !shopitem.roles.includes(r))
  : [...cmd.member.roles.cache.map((r) => r.id), ...shopitem.roles];

 ch.replyCmd(cmd, {
  content: cmd.member.roles.cache.hasAll(...shopitem.roles)
   ? language.slashCommands.roles.shop.unequipt
   : language.slashCommands.roles.shop.equipt,
 });

 ch.request.guilds.editMember(cmd.guild, cmd.user.id, { roles }, language.autotypes.shop);
};
