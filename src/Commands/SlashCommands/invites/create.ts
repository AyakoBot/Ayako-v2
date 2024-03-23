import * as Discord from 'discord.js';
import { canCreateInvite } from '../../../BaseClient/UtilModules/requestHandler/channels/createInvite.js';
import { AllNonThreadGuildChannelTypes } from '../../../Typings/Channel.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const channel =
  cmd.options.getChannel('channel', false, AllNonThreadGuildChannelTypes) ?? cmd.channel;
 const maxUses = cmd.options.getInteger('max-uses', false);
 const maxAge = cmd.options.getString('max-age', false);
 const temporary = cmd.options.getBoolean('temporary', false);
 const unique = cmd.options.getBoolean('unique', false);
 const reason = cmd.options.getString('reason', false);
 const language = await cmd.client.util.getLanguage(cmd.guildId);

 if (!channel) {
  cmd.client.util.errorCmd(cmd, language.errors.channelNotFound, language);
  return;
 }

 if (!canCreateInvite(channel.id, cmd.member)) {
  cmd.client.util.errorCmd(cmd, language.errors.cantCreateInviteYou, language);
  return;
 }

 const me = await cmd.client.util.getBotMemberFromGuild(cmd.guild);
 const lan = language.slashCommands.invites;

 if (!canCreateInvite(channel.id, me)) {
  cmd.client.util.errorCmd(cmd, language.errors.cantCreateInvite, language);
  return;
 }

 const duration = maxAge ? cmd.client.util.getDuration(maxAge, 604800000) : undefined;

 const invite = await cmd.client.util.request.channels
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
  cmd.client.util.errorCmd(cmd, invite.message, language);
  return;
 }

 cmd.client.util.replyCmd(cmd, { content: lan.created(invite) });
};
