import * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';

export default async (cmd: Discord.CommandInteraction) => {
 if (!cmd.inGuild()) return;
 if (!cmd.inCachedGuild()) return;

 const language = await ch.languageSelector(cmd.guild?.id);
 const lan = language.slashCommands.stp;
 const string = cmd.options.get('string', true).value as string;

 let returned: string | null = null;

 try {
  returned = ch.stp(string, { cmd });
 } catch (e) {
  returned = (e as { message: string }).message;
 }

 const embed: Discord.APIEmbed = {
  description: returned,
  fields: [
   {
    name: '\u200b',
    value: `${language.Examples}: ${ch.util.makeCodeBlock(lan.desc)}`,
   },
  ],
 };

 ch.replyCmd(cmd, {
  embeds: [embed],
  ephemeral: true,
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
      url: 'https://discord.js.org/#/docs/discord.js/main/class/CommandInteraction',
      label: lan.button,
      style: Discord.ButtonStyle.Link,
     },
    ],
   },
  ],
 });
};
