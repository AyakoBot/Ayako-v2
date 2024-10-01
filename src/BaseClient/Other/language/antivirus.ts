import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default (t: CT.Language) => ({
 ...t.JSON.antivirus,
 malicious: (cross: string) => t.stp(t.JSON.antivirus.malicious, { cross }),
 clean: (check: string) => t.stp(t.JSON.antivirus.clean, { check }),
 log: {
  ...t.JSON.antivirus.log,
  vtStats: (m: string, s: string, h: string, u: string) =>
   t.stp(t.JSON.antivirus.log.vtStats, { m, s, h, u }),
  detectedAs: (c: string) => t.stp(t.JSON.antivirus.log.detectedAs, { c }),
  value: (msg: Discord.Message) =>
   t.stp(t.JSON.antivirus.log.value, {
    msg,
    name: 'name' in msg.channel ? msg.channel.name : t.JSON.t.Unknown,
   }),
 },
});
