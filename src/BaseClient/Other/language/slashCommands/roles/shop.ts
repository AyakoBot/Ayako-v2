import * as CT from '../../../../../Typings/Typings.js';
import * as ch from '../../../../ClientHelper.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.roles.shop,
 notEnoughMoney: (emote: string) =>
  t.stp(t.JSON.slashCommands.roles.shop.notEnoughMoney, { emote }),
 buyTheseFor: (amount: string) => t.stp(t.JSON.slashCommands.roles.shop.buyTheseFor, { amount }),
 buyThisFor: (amount: string) => t.stp(t.JSON.slashCommands.roles.shop.buyThisFor, { amount }),
 description: (balance: number, emote: string, cId: string) =>
  t.stp(t.JSON.slashCommands.roles.shop.description, {
   balance: ch.util.makeInlineCode(String(ch.splitByThousand(balance))),
   emote,
   cId,
  }),
 oneRole: (link: string) => t.stp(t.JSON.slashCommands.roles.shop.oneRole, { link }),
 manyRoles: (link: string) => t.stp(t.JSON.slashCommands.roles.shop.manyRoles, { link }),
});
