import * as CT from '../../../../../Typings/CustomTypings.js';
import application from './application.js';
import automodExec from './automodExec.js';
import automodRule from './automodRule.js';
import channel from './channel.js';
import guild from './guild.js';
import integration from './integration.js';
import invite from './invite.js';
import message from './message.js';
import reaction from './reaction.js';
import roles from './roles.js';
import scheduledEvent from './scheduledEvent.js';
import sticker from './sticker.js';
import user from './user.js';
import voiceState from './voiceState.js';
import webhook from './webhook.js';

export default (t: CT.Language) => ({
 ...t.JSON.events.logs,
 addedRemoved: (added: string, removed: string) =>
  `__**${t.JSON.t.Added}**__\n${added}\n\n__**${t.JSON.t.Removed}**__\n${removed}`,
 beforeAfter: (before: string, after: string) =>
  `__**${t.JSON.t.Before}**__\n${before}\n\n__**${t.JSON.t.After}**__\n${after}`,
 sticker: sticker(t),
 application: application(t),
 scheduledEvent: scheduledEvent(t),
 voiceState: voiceState(t),
 webhook: webhook(t),
 role: roles(t),
 reaction: reaction(t),
 message: message(t),
 invite: invite(t),
 integration: integration(t),
 guild: guild(t),
 channel: channel(t),
 user: user(t),
 automodExec: automodExec(t),
 automodRule: automodRule(t),
});
