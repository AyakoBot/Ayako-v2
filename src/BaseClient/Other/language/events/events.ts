import * as CT from '../../../../Typings/CustomTypings.js';
import guildMemberUpdate from './guildMemberUpdate.js';
import appeal from './logs/appeal.js';
import interactionCreate from './logs/interactionCreate.js';
import logs from './logs/logs.js';
import ready from './logs/ready.js';
import vote from './logs/vote.js';

export default (t: CT.Language) => ({
 ...t.JSON.events,
 logs: logs(t),
 guildMemberUpdate: guildMemberUpdate(t),
 guildMemberAdd: t.JSON.events.guildMemberAdd,
 censor: t.JSON.events.censor,
 ready: ready(t),
 vote: vote(t),
 appeal: appeal(t),
 interactionCreate: interactionCreate(t),
});
