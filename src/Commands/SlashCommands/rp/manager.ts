import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import * as CT from '../../../Typings/Typings.js';

export default async (
 cmd: Discord.ChatInputCommandInteraction | Discord.ButtonInteraction,
 _: string[],
 isReplied = false,
) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.rp;

 const guildsettings = await ch.DataBase.guildsettings.findUnique({
  where: { guildid: cmd.guildId },
 });

 const payload = {
  embeds: [
   {
    author: {
     name: lan.author,
    },
    description: `${lan.desc}`,
    color: ch.getColor(await ch.getBotMemberFromGuild(cmd.guild)),
    fields: lan.fields(
     guildsettings?.lastrpsyncrun
      ? ch.constants.standard.getTime(Number(guildsettings.lastrpsyncrun))
      : ch.util.makeInlineCode(language.t.Never),
     Number(guildsettings?.rpenableruns ?? 0) ?? 0,
    ),
   },
  ],
  components: getComponents(language, lan, cmd, guildsettings),
 };

 if (isReplied) {
  if (!cmd.isMessageComponent()) return;
  await cmd.editReply(payload);
 } else ch.replyCmd(cmd, payload);
};

export const getComponents = (
 language: CT.Language,
 lan: CT.Language['slashCommands']['rp'],
 cmd: Discord.ChatInputCommandInteraction<'cached'> | Discord.ButtonInteraction<'cached'>,
 guildsettings?: CT.DePromisify<ReturnType<(typeof ch)['DataBase']['guildsettings']['findUnique']>>,
): Discord.APIActionRowComponent<Discord.APIButtonComponent>[] => [
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   {
    type: Discord.ComponentType.Button,
    label: lan.button,
    style: guildsettings?.enabledrp ? Discord.ButtonStyle.Success : Discord.ButtonStyle.Danger,
    custom_id: 'rp/toggle',
    emoji: guildsettings?.enabledrp ? ch.emotes.enabled : ch.emotes.disabled,
    disabled:
     !cmd.member.permissions.has(Discord.PermissionsBitField.Flags.ManageGuild) ||
     Number(guildsettings?.rpenableruns) === 2,
   },
   {
    type: Discord.ComponentType.Button,
    label: lan.sync,
    style: Discord.ButtonStyle.Secondary,
    custom_id: 'rp/sync',
    emoji: ch.emotes.refresh,
    disabled:
     !cmd.member.permissions.has(Discord.PermissionsBitField.Flags.ManageGuild) ||
     !guildsettings?.enabledrp ||
     Number(guildsettings?.lastrpsyncrun) > Date.now() - 3600000,
   },
   {
    type: Discord.ComponentType.Button,
    label: language.t.login,
    style: Discord.ButtonStyle.Link,
    url: 'https://ayakobot.com/login',
   },
  ],
 },
];
