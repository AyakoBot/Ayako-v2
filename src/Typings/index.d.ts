import Util from '../BaseClient/Bot/util.js';

declare module 'discord.js' {
 // The generic signature MUST match the original class exactly:
 // `class Client<Ready extends boolean = boolean>`
 interface Client<Ready extends boolean = boolean> {
  util: Util;
 }
}
