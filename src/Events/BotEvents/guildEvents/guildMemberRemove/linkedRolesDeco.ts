import type { GuildMember } from 'discord.js';
import linkedRolesDeco from '../guildMemberUpdate/linkedRolesDeco';

export default async (member: GuildMember) => {
 linkedRolesDeco(member, []);
};
