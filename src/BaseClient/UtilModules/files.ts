import { Prisma } from '@prisma/client';
import * as Sharding from 'discord-hybrid-sharding';
import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';

import * as endGiveaway from '../../Commands/SlashCommands/giveaway/end.js';
import * as createReminder from '../../Commands/SlashCommands/reminder/create.js';
import * as typings from '../../Typings/Typings.js';
import importCache from './importCache.js';

export default {
 // Packages
 prisma: Prisma,
 jobs: Jobs,
 discord: Discord,
 sharding: Sharding,

 // Files
 '/Typings/Typings.js': typings,
 '/Commands/SlashCommands/giveaway/end.js': endGiveaway,
 '/Commands/SlashCommands/reminder/create.js': createReminder,

 // importCache
 importCache,
};
