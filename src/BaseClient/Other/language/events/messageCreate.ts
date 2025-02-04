import type { Channel, Role, User } from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.events.messageCreate,
 pingReporter: {
  ...t.JSON.events.messageCreate.pingReporter,
  desc: (role: Role, channel: Channel, user: User) =>
   t.stp(t.JSON.events.messageCreate.pingReporter.desc, {
    role: t.languageFunction.getRole(role),
    channel: t.languageFunction.getChannel(channel, t.channelTypes[channel.type]),
    user: t.languageFunction.getUser(user),
   }),
 },
});
