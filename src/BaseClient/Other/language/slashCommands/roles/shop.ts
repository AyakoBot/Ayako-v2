import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.roles.shop,
 notEnoughMoney: (emote: string) =>
  t.stp(t.JSON.slashCommands.roles.shop.notEnoughMoney, { emote }),
 buyFor: (amount: string, num: number) =>
  t.stp(t.JSON.slashCommands.roles.shop.buyFor, { amount, num: String(num) }),
 unequip: (num: number) => t.stp(t.JSON.slashCommands.roles.shop.unequip, { num: String(num) }),
 equip: (num: number) => t.stp(t.JSON.slashCommands.roles.shop.equip, { num: String(num) }),
 description: (balance: number, emote: string, cId: string) =>
  t.stp(t.JSON.slashCommands.roles.shop.description, {
   balance: t.util.util.makeInlineCode(String(t.util.splitByThousand(balance))),
   emote,
   cId,
  }),
 oneRole: (link: string) => t.stp(t.JSON.slashCommands.roles.shop.oneRole, { link }),
 manyRoles: (link: string) => t.stp(t.JSON.slashCommands.roles.shop.manyRoles, { link }),
});
