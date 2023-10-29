import * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import { AllNonThreadGuildChannelTypes } from '../../../BaseClient/Other/constants.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const channel =
  cmd.options.getChannel('channel', false, AllNonThreadGuildChannelTypes) ?? cmd.channel;
 const maxUses = cmd.options.getInteger('max-uses', false);
 const maxAge = cmd.options.getString('max-age', false);
 const temporary = cmd.options.getBoolean('temporary', false);
 const unique = cmd.options.getBoolean('unique', false);
 const reason = cmd.options.getString('reason', false);

 const me = await ch.getBotMemberFromGuild(cmd.guild);
 if (!me) return;
 const language = await ch.getLanguage(cmd.guildId);
 const lan = language.slashCommands.invites;

 if (!channel?.permissionsFor(me)?.has(Discord.PermissionFlagsBits.CreateInstantInvite)) {
  ch.errorCmd(cmd, language.errors.cantManageChannel, language);
  return;
 }

 const duration = maxAge ? ch.getDuration(maxAge, 604800000) : undefined;

 const invite = await ch.request.channels
  .createInvite(
   channel,
   {
    max_age: duration ? duration / 1000 : undefined,
    max_uses: maxUses ?? undefined,
    temporary: !!temporary,
    unique: !!unique,
   },
   `${cmd.user.displayName}${reason ? `: ${reason}` : ''}`,
  )
  .catch((e) => e);

 if ('message' in invite) {
  ch.errorCmd(cmd, invite.message, language);
  return;
 }

 ch.replyCmd(cmd, { content: lan.created(invite) });
};
