import * as Discord from 'discord.js';
import { colors } from '../../BaseClient/UtilModules/getColor.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.suggest;
 const settings = await cmd.client.util.DataBase.suggestionsettings.findUnique({
  where: { guildid: cmd.guildId, active: true, channelid: { not: null } },
 });
 if (!settings || !settings.channelid) {
  cmd.client.util.errorCmd(cmd, lan.notEnabled, language);
  return;
 }

 if (
  settings.nosendusers.includes(cmd.user.id) ||
  settings.nosendroles.some((r) => cmd.member.roles.cache.has(r))
 ) {
  cmd.client.util.errorCmd(cmd, lan.cannotSend, language);
  return;
 }

 const content = cmd.options.getString('content', true);
 const attachments = new Array(5)
  .fill(null)
  .map((_, i) => cmd.options.getAttachment(`attachment-${i}`, false))
  .filter((a): a is Discord.Attachment => !!a);

 const files = await cmd.client.util.fileURL2Buffer(attachments.map((a) => a.url));

 cmd.client.util.replyCmd(cmd, {
  content: lan.sent,
 });

 const m = await cmd.client.util.send(
  { id: settings.channelid, guildId: cmd.guildId },
  {
   content:
    `${
     settings.pingroleid.length ? `${settings.pingroleid.map((i) => `<@&${i}>`).join(' ')}\n` : ''
    }${
     settings.pinguserid.length ? `${settings.pinguserid.map((i) => `<@${i}>`).join(' ')}\n` : ''
    }` || undefined,
   allowed_mentions: { users: settings.pinguserid, roles: settings.pingroleid },
   embeds: [
    {
     color: cmd.client.util.getColor(
      Object.keys(colors)[cmd.client.util.getRandom(0, Object.keys(colors).length - 1)],
     ),
     author: {
      name: `${lan.author}${settings.anonsuggestion ? '' : ` | ${cmd.user.displayName}`}`,
     },
     description: content,
     image:
      attachments.length === 1
       ? {
          url: `attachment://${files[0].name}`,
         }
       : undefined,
     fields: [
      {
       name: lan.votes,
       value: `${cmd.client.util.constants.standard.getEmote(
        cmd.client.util.emotes.tickWithBackground,
       )}: 0\n${cmd.client.util.constants.standard.getEmote(
        cmd.client.util.emotes.crossWithBackground,
       )}: 0`,
      },
     ],
    },
   ],
   files,
   components: [
    {
     type: Discord.ComponentType.ActionRow,
     components: [
      {
       type: Discord.ComponentType.Button,
       style: Discord.ButtonStyle.Success,
       custom_id: 'suggestion/tick',
       emoji: cmd.client.util.emotes.tickWithBackground,
      },
      {
       type: Discord.ComponentType.Button,
       style: Discord.ButtonStyle.Secondary,
       label: lan.view,
       custom_id: 'suggestion/view',
      },
      {
       type: Discord.ComponentType.Button,
       style: Discord.ButtonStyle.Danger,
       custom_id: 'suggestion/cross',
       emoji: cmd.client.util.emotes.crossWithBackground,
      },
     ],
    },
    {
     type: Discord.ComponentType.ActionRow,
     components: [
      {
       type: Discord.ComponentType.Button,
       style: Discord.ButtonStyle.Success,
       label: lan.accept,
       custom_id: 'suggestion/accept',
      },
      {
       type: Discord.ComponentType.Button,
       style: Discord.ButtonStyle.Secondary,
       emoji: cmd.client.util.emotes.ban,
       custom_id: 'suggestion/ban',
      },
      {
       type: Discord.ComponentType.Button,
       style: Discord.ButtonStyle.Danger,
       label: lan.reject,
       custom_id: 'suggestion/reject',
      },
     ],
    },
    {
     type: Discord.ComponentType.ActionRow,
     components: [
      {
       type: Discord.ComponentType.Button,
       style: Discord.ButtonStyle.Secondary,
       custom_id: 'suggestion/delete',
       emoji: cmd.client.util.emotes.trash,
      },
     ],
    },
   ],
  },
 );

 if (!m) return;

 cmd.client.util.DataBase.suggestionvotes
  .create({
   data: {
    msgid: m.id,
    userid: cmd.user.id,
    guildid: cmd.guildId,
    channelid: cmd.channelId,
   },
  })
  .then();
};
