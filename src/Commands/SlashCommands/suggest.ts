import * as Discord from 'discord.js';
import * as ch from '../../BaseClient/ClientHelper.js';
import { colors } from '../../BaseClient/ClientHelperModules/getColor.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.suggest;
 const settings = await ch.DataBase.suggestionsettings.findUnique({
  where: { guildid: cmd.guildId, active: true, channelid: { not: null } },
 });
 if (!settings || !settings.channelid) {
  ch.errorCmd(cmd, lan.notEnabled, language);
  return;
 }

 if (
  settings.nosendusers.includes(cmd.user.id) ||
  settings.nosendroles.some((r) => cmd.member.roles.cache.has(r))
 ) {
  ch.errorCmd(cmd, lan.cannotSend, language);
  return;
 }

 const content = cmd.options.getString('content', true);
 const attachments = new Array(5)
  .fill(null)
  .map((_, i) => cmd.options.getAttachment(`attachment-${i}`, false))
  .filter((a): a is Discord.Attachment => !!a);

 const files = await ch.fileURL2Buffer(attachments.map((a) => a.url));

 ch.replyCmd(cmd, {
  content: lan.sent,
 });

 const m = await ch.send(
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
     color: ch.getColor(Object.keys(colors)[ch.getRandom(0, Object.keys(colors).length - 1)]),
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
       value: `${ch.constants.standard.getEmote(
        ch.emotes.tickWithBackground,
       )}: 0\n${ch.constants.standard.getEmote(ch.emotes.crossWithBackground)}: 0`,
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
       emoji: ch.emotes.tickWithBackground,
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
       emoji: ch.emotes.crossWithBackground,
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
       emoji: ch.emotes.ban,
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
       emoji: ch.emotes.trash,
      },
     ],
    },
   ],
  },
 );

 if (!m) return;

 ch.DataBase.suggestionvotes
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
