import * as CT from '../../../../Typings/Typings.js';
import banAdd from './logs/banAdd.js';
import banRemove from './logs/banRemove.js';
import channelBanAdd from './logs/channelBanAdd.js';
import channelBanRemove from './logs/channelBanRemove.js';
import kickAdd from './logs/kickAdd.js';
import muteRemove from './logs/muteRemove.js';
import roleAdd from './logs/roleAdd.js';
import roleRemove from './logs/roleRemove.js';
import softBanAdd from './logs/softBanAdd.js';
import softWarnAdd from './logs/softWarnAdd.js';
import strikeAdd from './logs/strikeAdd.js';
import tempBanAdd from './logs/tempBanAdd.js';
import tempChannelBanAdd from './logs/tempChannelBanAdd.js';
import tempMuteAdd from './logs/tempMuteAdd.js';
import unAfk from './logs/unAfk.js';
import warnAdd from './logs/warnAdd.js';

export default (t: CT.Language) => ({
 ...t.JSON.mod.logs,
 banAdd: banAdd(t),
 banRemove: banRemove(t),
 channelBanAdd: channelBanAdd(t),
 channelBanRemove: channelBanRemove(t),
 kickAdd: kickAdd(t),
 muteRemove: muteRemove(t),
 roleAdd: roleAdd(t),
 roleRemove: roleRemove(t),
 softBanAdd: softBanAdd(t),
 softWarnAdd: softWarnAdd(t),
 strikeAdd: strikeAdd(t),
 tempBanAdd: tempBanAdd(t),
 tempChannelBanAdd: tempChannelBanAdd(t),
 tempMuteAdd: tempMuteAdd(t),
 unAfk: unAfk(t),
 warnAdd: warnAdd(t),
});
