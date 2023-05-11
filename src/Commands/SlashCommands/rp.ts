import * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';
import * as DBT from '../../Typings/DataBaseTypings.js';

export default async (
 cmd: Discord.ChatInputCommandInteraction | Discord.ButtonInteraction,
 _: string[],
 isReplied?: boolean,
) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.rp;

 const currentSetting = await ch
  .query(`SELECT * FROM guildsettings WHERE guildid = $1;`, [cmd.guildId])
  .then((r: DBT.guildsettings[] | null) => r?.[0].enabledrp);

 const payload: Discord.InteractionReplyOptions = {
  embeds: [
   {
    author: {
     name: lan.author,
    },
    description: `${lan.desc}`,
    color: ch.colorSelector(cmd.guild.members.me),
   },
  ],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      label: lan.button,
      style: currentSetting ? Discord.ButtonStyle.Success : Discord.ButtonStyle.Danger,
      customId: 'rp',
      emoji: currentSetting ? ch.objectEmotes.enabled : ch.objectEmotes.disabled,
      disabled: !cmd.member.permissions.has(Discord.PermissionsBitField.Flags.ManageGuild),
     },
     {
      type: Discord.ComponentType.Button,
      label: language.login,
      style: Discord.ButtonStyle.Link,
      url: 'https://ayakobot.com/login',
     },
    ],
   },
  ],
 };

 if (isReplied) {
  if (!cmd.isMessageComponent()) return;
  await cmd.update(payload as Discord.InteractionUpdateOptions);

  cmd.followUp({
   content: lan.delay,
   ephemeral: true,
  });
 } else ch.replyCmd(cmd, payload);
};
