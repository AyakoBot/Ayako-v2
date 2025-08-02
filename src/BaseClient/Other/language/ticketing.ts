import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.ticketing,
 logs: {
  ...t.JSON.ticketing.logs,
  descCreate: (user: Discord.User, channel: Discord.GuildTextBasedChannel) =>
   t.stp(t.JSON.ticketing.logs.descCreate, {
    user: t.languageFunction.getUser(user),
    channel: t.languageFunction.getChannel(channel),
   }),
  descClose: (user: Discord.User, channel: Discord.GuildTextBasedChannel) =>
   t.stp(t.JSON.ticketing.logs.descClose, {
    user: t.languageFunction.getUser(user),
    channel: t.languageFunction.getChannel(channel),
   }),
  descLeave: (
   user: Discord.User | { bot: boolean; id: string; username: string; discriminator: string },
   channel: Discord.GuildTextBasedChannel,
  ) =>
   t.stp(t.JSON.ticketing.logs.descLeave, {
    user: t.languageFunction.getUser(user),
    channel: t.languageFunction.getChannel(channel),
   }),
  descDelete: (user: Discord.User, channel: Discord.GuildTextBasedChannel) =>
   t.stp(t.JSON.ticketing.logs.descDelete, {
    user: t.languageFunction.getUser(user),
    channel: t.languageFunction.getChannel(channel),
   }),
  descClaimed: (user: Discord.User, channel: Discord.GuildTextBasedChannel) =>
   t.stp(t.JSON.ticketing.logs.descClaimed, {
    user: t.languageFunction.getUser(user),
    channel: t.languageFunction.getChannel(channel),
   }),
 },
});
