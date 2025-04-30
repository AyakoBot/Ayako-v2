import type { Reminder } from '@prisma/client';
import type { Serialized } from 'discord-hybrid-sharding';
import { end } from '../../../Commands/SlashCommands/reminder/create.js';

export default (payload: Serialized<Reminder>) => end(payload);
