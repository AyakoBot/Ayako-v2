import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (
 cmd: Discord.ChatInputCommandInteraction | Discord.ButtonInteraction,
 _: string[],
 isReplied = false,
) => {
 if (!cmd.inCachedGuild()) {
  cmd.client.util.guildOnly(cmd);
  return;
 }

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.rp;

 const guildsettings = await cmd.client.util.DataBase.$transaction([
  cmd.client.util.DataBase.guildsettings.upsert({
   where: { guildid: cmd.guildId },
   update: {},
   create: { guildid: cmd.guildId },
  }),
  cmd.client.util.DataBase.customclients.findUnique({
   where: { guildid: cmd.guildId },
   select: { appid: true },
  }),
 ]).then(([g, c]) => ({ ...g, appid: c?.appid ?? null }));

 const payload = {
  embeds: [
   {
    author: { name: lan.author },
    description: `${lan.desc}`,
    color: cmd.client.util.getColor(await cmd.client.util.getBotMemberFromGuild(cmd.guild)),
    fields: lan.fields(
     guildsettings?.lastrpsyncrun
      ? cmd.client.util.constants.standard.getTime(Number(guildsettings.lastrpsyncrun))
      : cmd.client.util.util.makeInlineCode(language.t.Never),
     Number(guildsettings?.rpenableruns ?? 0) ?? 0,
    ),
   },
  ],
  components: getComponents(language, lan, cmd, guildsettings ?? undefined),
 };

 if (isReplied) {
  if (!cmd.isMessageComponent()) return;
  await cmd.editReply(payload);
 } else cmd.client.util.replyCmd(cmd, payload);
};

export const getComponents = (
 language: CT.Language,
 lan: CT.Language['slashCommands']['rp'],
 cmd: Discord.ChatInputCommandInteraction<'cached'> | Discord.ButtonInteraction<'cached'>,
 guildsettings?: CT.DataBaseTables['guildsettings'] & { appid: string | null },
): Discord.APIActionRowComponent<Discord.APIButtonComponent>[] => [
 {
  type: Discord.ComponentType.ActionRow,
  components: [
   {
    type: Discord.ComponentType.Button,
    label: lan.button,
    style: guildsettings?.enabledrp ? Discord.ButtonStyle.Success : Discord.ButtonStyle.Danger,
    custom_id: 'rp/toggle',
    emoji: guildsettings?.enabledrp
     ? cmd.client.util.emotes.enabled
     : cmd.client.util.emotes.disabled,
    disabled:
     !cmd.member.permissions.has(Discord.PermissionsBitField.Flags.ManageGuild) ||
     Number(guildsettings?.rpenableruns) === 2 ||
     cmd.client.util.cache.interactionInstallmentRunningFor.has(cmd.guildId),
   },
   {
    type: Discord.ComponentType.Button,
    label: lan.sync,
    style: Discord.ButtonStyle.Secondary,
    custom_id: 'rp/sync',
    emoji: cmd.client.util.emotes.refresh,
    disabled:
     !cmd.member.permissions.has(Discord.PermissionsBitField.Flags.ManageGuild) ||
     !guildsettings?.enabledrp ||
     Number(guildsettings?.lastrpsyncrun) > Date.now() - 3600000,
   },
   {
    type: Discord.ComponentType.Button,
    label: language.t.login,
    style: Discord.ButtonStyle.Link,
    url: `https://discord.com/oauth2/authorize?client_id=${
     guildsettings?.appid ?? process.env.mainId
    }&response_type=code&redirect_uri=https%3A%2F%2Fayakobot.com%2Flogin&scope=${
     Discord.OAuth2Scopes.ApplicationCommandsPermissionsUpdate
    }+${Discord.OAuth2Scopes.Identify}${guildsettings?.appid ? `&state=${cmd.guildId}` : ''}`,
    disabled: !cmd.member.permissions.has(Discord.PermissionsBitField.Flags.ManageGuild),
   },
  ],
 },
];
