import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const channel =
  cmd.options.getChannel('channel', false, CT.AllNonThreadGuildChannelTypes) ?? cmd.channel;
 const maxUses = cmd.options.getInteger('max-uses', false);
 const maxAge = cmd.options.getString('max-age', false);
 const temporary = cmd.options.getBoolean('temporary', false);
 const unique = cmd.options.getBoolean('unique', false);
 const reason = cmd.options.getString('reason', false);

 const me = await cmd.client.util.getBotMemberFromGuild(cmd.guild);
 if (!me) return;
 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.invites;

 if (!channel?.permissionsFor(me)?.has(Discord.PermissionFlagsBits.CreateInstantInvite)) {
  cmd.client.util.errorCmd(cmd, language.errors.cantManageChannel, language);
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
