import type { RChannel, RMessage } from 'src/Typings/Redis.js';
import * as CT from '../../../Typings/Typings.js';
import type { APIMessage } from 'discord-api-types/v10.js';

export default (t: CT.Language) => ({
 ...t.JSON.antivirus,
 malicious: (cross: string) => t.stp(t.JSON.antivirus.malicious, { cross }),
 clean: (check: string) => t.stp(t.JSON.antivirus.clean, { check }),
 log: {
  ...t.JSON.antivirus.log,
  vtStats: (m: string, s: string, h: string, u: string) =>
   t.stp(t.JSON.antivirus.log.vtStats, { m, s, h, u }),
  detectedAs: (c: string) => t.stp(t.JSON.antivirus.log.detectedAs, { c }),
  value: (msg: RMessage | APIMessage, channel: RChannel | null) =>
   t.stp(t.JSON.antivirus.log.value, {
    msg,
    name: channel ? ('name' in channel ? channel.name : t.JSON.t.Unknown) : t.JSON.t.Unknown,
   }),
 },
});
