import * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';
import * as CT from '../../Typings/Typings.js';

export default async (
 cmd: Discord.ChatInputCommandInteraction | Discord.StringSelectMenuInteraction,
) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.roles.shop;

 const settings = await ch.DataBase.shop.findUnique({
  where: { guildid: cmd.guildId, active: true },
 });
 if (!settings) {
  ch.errorCmd(cmd, lan.notEnabled, language);
  return;
 }

 const shopItems = await ch.DataBase.shopitems.findMany({
  where: { guildid: cmd.guildId, roles: { isEmpty: false } },
 });
 if (!shopItems) {
  ch.errorCmd(cmd, lan.notEnabled, language);
  return;
 }

 const balance = await ch.DataBase.balance.findUnique({
  where: { userid_guildid: { guildid: cmd.guildId, userid: cmd.user.id }, balance: { gt: 0 } },
 });

 const currencyEmote = ch.constants.standard.getEmote(
  settings.currencyemote
   ? Discord.parseEmoji(settings.currencyemote) ?? ch.emotes.book
   : ch.emotes.book,
 );

 const user = await ch.DataBase.shopusers.findUnique({
  where: { userid_guildid: { guildid: cmd.guildId, userid: cmd.user.id } },
 });

 const buyable = shopItems.filter((i) => !user?.boughtids.includes(String(i.uniquetimestamp)));
 const equippable = shopItems.filter((i) => user?.boughtids.includes(String(i.uniquetimestamp)));

 const selMenu: Discord.APISelectMenuComponent[] = [
  {
   type: Discord.ComponentType.StringSelect,
   custom_id: 'shop/buy',
   placeholder: lan.selRoleToBuy,
   min_values: 1,
   max_values: 1,
   disabled: !buyable.length,
   options: buyable.length
    ? buyable.map((s) => ({
       emoji: ch.emotes.buy,
       label: `${(s.roles.length > 1 ? lan.buyTheseFor : lan.buyThisFor)(
        ch.splitByThousand(Number(s.price)),
       )}`,
       description: `${s.roles
        .map((r) => cmd.guild.roles.cache.get(r)?.name)
        .filter((r): r is string => !!r)
        .join(', ')
        .slice(0, 100)}`,
       value: String(s.uniquetimestamp),
      }))
    : [{ label: '-', value: '-' }],
  },
  {
   type: Discord.ComponentType.StringSelect,
   custom_id: 'shop/equip',
   placeholder: lan.selRoleToEquip,
   min_values: 1,
   max_values: 1,
   disabled: !equippable.length,
   options: equippable.length
    ? equippable.map((s) => ({
       emoji: cmd.member.roles.cache.hasAll(...s.roles) ? ch.emotes.minusBG : ch.emotes.plusBG,
       label: cmd.member.roles.cache.hasAll(...s.roles) ? lan.unequip : lan.equip,
       description: `${s.roles
        .map((r) => cmd.guild.roles.cache.get(r)?.name)
        .filter((r): r is string => !!r)
        .join(', ')
        .slice(0, 100)}`,
       value: String(s.uniquetimestamp),
      }))
    : [{ label: '-', value: '-' }],
  },
 ];

 const payload: CT.UsualMessagePayload = {
  embeds: [
   {
    author: {
     name: language.autotypes.shop,
    },
    description: lan.description(
     Number(balance?.balance ?? 0),
     currencyEmote,
     (await ch.getCustomCommand(cmd.guild, 'balance'))?.id ?? '0',
    ),
    fields: shopItems.map((s, i) => ({
     name: `#${i + 1} - ${s.price} ${currencyEmote}`,
     value: `${s.roles.map((r) => `<@&${r}>`).join(', ')}${
      s.shoptype === 'message'
       ? `\n${(s.roles.length > 1 ? lan.oneRole : lan.manyRoles)(
          ch.constants.standard.msgurl(cmd.guildId, s.channelid ?? '', s.msgid ?? ''),
         )}`
       : ''
     }`,
     inline: true,
    })),
    color: ch.getColor(await ch.getBotMemberFromGuild(cmd.guild)),
   },
  ],
  components: selMenu.map((s) => ({
   type: Discord.ComponentType.ActionRow,
   components: [s],
  })),
 };

 if (cmd instanceof Discord.ChatInputCommandInteraction) ch.replyCmd(cmd, payload);
 else cmd.update(payload);
};
