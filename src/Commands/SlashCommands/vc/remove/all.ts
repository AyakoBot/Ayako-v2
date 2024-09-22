import { ChatInputCommandInteraction, OverwriteType, PermissionsBitField } from 'discord.js';
import { getVCSettings, isValidChannel, meIsPermittedDel, validateSuccess } from '../add/member.js';
import {
 managerPermissions,
 memberPermissions,
} from 'src/Events/BotEvents/voiceStateEvents/voiceStateCreates/voiceHub.js';

export default async (cmd: ChatInputCommandInteraction, filterBy: bigint = 0n) => {
 if (!cmd.inCachedGuild()) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);

 const channel = cmd.options.getChannel('channel', false) ?? cmd.channel;
 if (!channel) return;

 if (!isValidChannel(cmd, channel, language)) return;
 if (!(await validateSuccess(cmd, language, channel))) return;
 if (!(await meIsPermittedDel(cmd, channel, language))) return;

 const vcSettings = await getVCSettings(cmd.guild, channel.id);
 if (!vcSettings) return;

 const perms = channel.permissionOverwrites.cache
  .filter(
   (p) => p.type === OverwriteType.Member && p.id !== vcSettings.ownerid && p.allow.has(filterBy),
  )
  .map((p) => p.id);

 const lan = language.slashCommands.vc;

 await Promise.all(
  perms.map((p) =>
   cmd.client.util.request.channels.deletePermissionOverwrite(
    channel,
    p,
    lan.reason(cmd.member.user.username),
   ),
  ),
 );

 const getLanFN = () => {
  switch (true) {
   case new PermissionsBitField(filterBy).has(managerPermissions):
    return lan.removedAllManagers;
   case new PermissionsBitField(filterBy).has(memberPermissions):
    return lan.removedAllMembers;
   default:
    return lan.removedAll;
  }
 };

 cmd.reply({
  content: getLanFN()(channel),
  ephemeral: true,
 });
};
