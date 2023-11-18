import * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.CommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guild?.id);
 const lan = language.slashCommands.stp;
 const string = cmd.options.get('string', true).value as string;

 let returned: string | null = null;

 try {
  returned = ch.stp(string, { cmd });
 } catch (e) {
  returned = (e as Error).message;
 }

 ch.replyCmd(cmd, {
  embeds: [
   {
    description: returned,
    fields: [
     {
      name: '\u200b',
      value: `${language.t.Examples}: ${ch.util.makeCodeBlock(
       '{{cmd.guild.name}}\n{{cmd.user.username}}\n{{cmd.channel.name}}',
      )}`,
     },
    ],
   },
  ],
  ephemeral: true,
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      custom_id: String(Date.now()),
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
      url: 'https://discord.js.org/#/docs/discord.js/main/class/CommandInteraction',
      label: lan.button,
      style: Discord.ButtonStyle.Link,
     },
    ],
   },
  ],
 });
};
