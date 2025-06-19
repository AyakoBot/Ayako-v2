import type { GuildMember } from 'discord.js';
import linkedRolesDeco from '../guildMemberUpdate/linkedRolesDeco.js';

export default async (member: GuildMember) => {
 linkedRolesDeco(member, []);
};
