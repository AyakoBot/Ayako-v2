import * as Discord from 'discord.js';
import * as CT from '../../../Typings/CustomTypings.js';

export default (t: CT.Language) => ({
 ...t.JSON.antivirus,
 malicious: (cross: string) => t.stp(t.JSON.antivirus.malicious, { cross }),
 log: {
  vtStats: (m: number, s: number, h: number, u: number) =>
   t.stp(t.JSON.antivirus.logs.vtStats, { m, s, h, u }),
  detectedAs: (c: string) => t.stp(t.JSON.antivirus.logs.detectedAs, { c }),
  value: (msg: Discord.Message) =>
   t.stp(t.JSON.antivirus.logs.value, {
    msg: t.languageFunction.getMessage(msg),
    name: 'name' in msg.channel ? msg.channel.name : t.Unknown,
   }),
 },
});
