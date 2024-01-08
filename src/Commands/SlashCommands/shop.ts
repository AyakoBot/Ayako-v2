import * as Discord from 'discord.js';
import * as CT from '../../Typings/Typings.js';

export default async (
 cmd: Discord.ChatInputCommandInteraction | Discord.StringSelectMenuInteraction,
) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.roles.shop;

 const settings = await cmd.client.util.DataBase.shop.findUnique({
  where: { guildid: cmd.guildId, active: true },
 });
 if (!settings) {
  cmd.client.util.errorCmd(cmd, lan.notEnabled, language);
  return;
 }

 const shopItems = await cmd.client.util.DataBase.shopitems.findMany({
  where: { guildid: cmd.guildId, roles: { isEmpty: false } },
 });
 if (!shopItems) {
  cmd.client.util.errorCmd(cmd, lan.notEnabled, language);
  return;
 }

 const balance = await cmd.client.util.DataBase.balance.findUnique({
  where: { userid_guildid: { guildid: cmd.guildId, userid: cmd.user.id }, balance: { gt: 0 } },
 });

 const currencyEmote = cmd.client.util.constants.standard.getEmote(
  settings.currencyemote
   ? Discord.parseEmoji(settings.currencyemote) ?? cmd.client.util.emotes.book
   : cmd.client.util.emotes.book,
 );

 const user = await cmd.client.util.DataBase.shopusers.findUnique({
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
       emoji: cmd.client.util.emotes.buy,
       label: `${(s.roles.length > 1 ? lan.buyTheseFor : lan.buyThisFor)(
        cmd.client.util.splitByThousand(Number(s.price)),
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
       emoji: cmd.member.roles.cache.hasAll(...s.roles)
        ? cmd.client.util.emotes.minusBG
        : cmd.client.util.emotes.plusBG,
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
     (await cmd.client.util.getCustomCommand(cmd.guild, 'balance'))?.id ?? '0',
    ),
    fields: shopItems.map((s, i) => ({
     name: `#${i + 1} - ${s.price} ${currencyEmote}`,
     value: `${s.roles.map((r) => `<@&${r}>`).join(', ')}${
      s.shoptype === 'message'
       ? `\n${(s.roles.length > 1 ? lan.oneRole : lan.manyRoles)(
          cmd.client.util.constants.standard.msgurl(cmd.guildId, s.channelid ?? '', s.msgid ?? ''),
         )}`
       : ''
     }`,
     inline: true,
    })),
    color: cmd.client.util.getColor(await cmd.client.util.getBotMemberFromGuild(cmd.guild)),
   },
  ],
  components: selMenu.map((s) => ({
   type: Discord.ComponentType.ActionRow,
   components: [s],
  })),
 };

 if (cmd instanceof Discord.ChatInputCommandInteraction) cmd.client.util.replyCmd(cmd, payload);
 else cmd.update(payload);
};
