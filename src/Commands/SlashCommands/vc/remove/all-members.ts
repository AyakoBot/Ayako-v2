import { ChatInputCommandInteraction, PermissionsBitField } from 'discord.js';
import { memberPermissions } from '../../../../Events/BotEvents/voiceStateEvents/voiceStateCreates/voiceHub.js';
import all from './all.js';

export default (cmd: ChatInputCommandInteraction) =>
 all(cmd, new PermissionsBitField(memberPermissions).bitfield);
