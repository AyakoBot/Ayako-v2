import * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';

export const cooldown = 0;
export const name = 'stp';
export const takesFirstArg = true;
export const aliases = [];
export const thisGuildOnly = [];
export const perm = 0n;
export const dmOnly = false;
export const type = 'other';

export default async (msg: Discord.Message, args: string[]) => {
 let returned;

 try {
  returned = ch.stp(args.join(' '), { msg });
 } catch (e) {
  returned = (e as Error).message;
 }

 const language = await ch.languageSelector(msg.guildId);
 const lan = language.slashCommands.stp;

 ch.replyMsg(msg, {
  embeds: [
   {
    description: returned,
    fields: [
     {
      name: '\u200b',
      value: `${language.Examples}: ${ch.util.makeCodeBlock(
       '{{msg.guild.name}}\n{{msg.user.username}}\n{{msg.channel.name}}',
      )}`,
     },
    ],
   },
  ],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      customId: String(Date.now()),
      label: lan.warn,
      style: Discord.ButtonStyle.Danger,
      disabled: true,
     },
    ],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      url: 'https://discord.js.org/#/docs/discord.js/main/class/Message',
      label: lan.button,
      style: Discord.ButtonStyle.Link,
     },
    ],
   },
  ],
 });
};
