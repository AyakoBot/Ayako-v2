import * as CT from '../../../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.info.server,
 author: t.stp(t.JSON.slashCommands.info.server.author, { t }),
 inviteGuild: t.stp(t.JSON.slashCommands.info.server.inviteGuild, { t }),
});
