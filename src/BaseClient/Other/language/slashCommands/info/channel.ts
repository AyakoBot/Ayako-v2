import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.info.channel,
 author: t.stp(t.JSON.slashCommands.info.channel.author, { t }),
 scheduledEvent: {
  ...t.JSON.slashCommands.info.channel.scheduledEvent,
  author: t.stp(t.JSON.slashCommands.info.channel.scheduledEvent.author, { t }),
 },
});
