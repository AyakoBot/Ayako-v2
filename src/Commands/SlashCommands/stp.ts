import * as Discord from 'discord.js';

export default async (cmd: Discord.CommandInteraction) => {
 const language = await cmd.client.util.getLanguage(cmd.guild?.id);
 const lan = language.slashCommands.stp;
 const string = cmd.options.get('string', true).value as string;

 let returned: string | null = null;

 try {
  returned = cmd.client.util.stp(string, { cmd });
 } catch (e) {
  returned = (e as Error).message;
 }

 cmd.client.util.replyCmd(cmd, {
  embeds: [
   {
    description: returned,
    fields: [
     {
      name: '\u200b',
      value: `${language.t.Examples}: ${cmd.client.util.util.makeCodeBlock(
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
