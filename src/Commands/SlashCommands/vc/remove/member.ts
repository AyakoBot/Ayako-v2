import { ChatInputCommandInteraction } from 'discord.js';
import member from '../add/member.js';

export default (cmd: ChatInputCommandInteraction) => member(cmd, 'member', 'demote');
