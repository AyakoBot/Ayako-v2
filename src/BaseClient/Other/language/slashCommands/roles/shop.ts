import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.roles.shop,
 notEnoughMoney: (emote: string) =>
  t.stp(t.JSON.slashCommands.roles.shop.notEnoughMoney, { emote }),
 buyTheseFor: (amount: string) => t.stp(t.JSON.slashCommands.roles.shop.buyTheseFor, { amount }),
 buyThisFor: (amount: string) => t.stp(t.JSON.slashCommands.roles.shop.buyThisFor, { amount }),
 description: (balance: number, emote: string, cId: string) =>
  t.stp(t.JSON.slashCommands.roles.shop.description, {
   balance: t.util.util.makeInlineCode(String(t.util.splitByThousand(balance))),
   emote,
   cId,
  }),
 oneRole: (link: string) => t.stp(t.JSON.slashCommands.roles.shop.oneRole, { link }),
 manyRoles: (link: string) => t.stp(t.JSON.slashCommands.roles.shop.manyRoles, { link }),
});
