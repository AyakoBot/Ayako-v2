import * as Discord from 'discord.js';
import * as CT from '../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.antivirus,
 malicious: (cross: string) => t.stp(t.JSON.antivirus.malicious, { cross }),
 log: {
  ...t.JSON.antivirus.log,
  vtStats: (m: number, s: number, h: number, u: number) =>
   t.stp(t.JSON.antivirus.log.vtStats, { m, s, h, u }),
  detectedAs: (c: string) => t.stp(t.JSON.antivirus.log.detectedAs, { c }),
  value: (msg: Discord.Message) =>
   t.stp(t.JSON.antivirus.log.value, {
    msg,
    name: 'name' in msg.channel ? msg.channel.name : t.JSON.t.Unknown,
   }),
 },
});
