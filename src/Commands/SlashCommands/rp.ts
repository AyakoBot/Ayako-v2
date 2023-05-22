import * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';
import * as DBT from '../../Typings/DataBaseTypings.js';

export default async (
 cmd: Discord.ChatInputCommandInteraction | Discord.ButtonInteraction,
 _: string[],
 isReplied = false,
) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.languageSelector(cmd.guildId);
 const lan = language.slashCommands.rp;

 const guildsettings = await ch
  .query(`SELECT * FROM guildsettings WHERE guildid = $1;`, [cmd.guildId])
  .then((r: DBT.guildsettings[] | null) => r?.[0]);

 const payload: Discord.InteractionReplyOptions = {
  embeds: [
   {
    author: {
     name: lan.author,
    },
    description: `${lan.desc}`,
    color: ch.colorSelector(cmd.guild.members.me),
    fields: [
     {
      name: lan.apiLimit,
      value: lan.apiLimitVal(Number(guildsettings?.rpenableruns ?? 0) ?? 0),
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
      label: lan.button,
      style: guildsettings?.enabledrp ? Discord.ButtonStyle.Success : Discord.ButtonStyle.Danger,
      customId: 'rp/toggle',
      emoji: guildsettings?.enabledrp ? ch.objectEmotes.enabled : ch.objectEmotes.disabled,
      disabled:
       !cmd.member.permissions.has(Discord.PermissionsBitField.Flags.ManageGuild) ||
       Number(guildsettings?.rpenableruns) === 2,
     },
     {
      type: Discord.ComponentType.Button,
      label: lan.sync,
      style: Discord.ButtonStyle.Secondary,
      customId: 'rp/sync',
      emoji: ch.objectEmotes.refresh,
      disabled:
       !cmd.member.permissions.has(Discord.PermissionsBitField.Flags.ManageGuild) ||
       !guildsettings?.enabledrp,
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
  cmd.update(payload as Discord.InteractionUpdateOptions);
 } else ch.replyCmd(cmd, payload);
};
