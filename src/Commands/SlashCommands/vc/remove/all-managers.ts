import { ChatInputCommandInteraction, PermissionsBitField } from 'discord.js';
import { managerPermissions } from '../../../../Events/BotEvents/voiceStateEvents/voiceStateCreates/voiceHub.js';
import all from './all.js';

export default (cmd: ChatInputCommandInteraction) =>
 all(cmd, new PermissionsBitField(managerPermissions).bitfield);
