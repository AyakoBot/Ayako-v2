import { Prisma } from '@prisma/client';
import * as Sharding from 'discord-hybrid-sharding';
import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';

import * as endGiveaway from '../../Commands/SlashCommands/giveaway/end.js';
import * as createReminder from '../../Commands/SlashCommands/reminder/create.js';
import * as typings from '../../Typings/Typings.js';
import constants from '../Other/constants.js';
import importCache from './importCache.js';
import mod from './mod.js';
import * as requestHandler from './requestHandler.js';

export default {
 // Packages
 prisma: Prisma,
 jobs: Jobs,
 discord: Discord,
 sharding: Sharding,

 // Files
 '/Typings/Typings.js': typings,
 '/BaseClient/Other/constants.js': constants,
 '/BaseClient/UtilModules/requestHandler.js': requestHandler,
 '/BaseClient/UtilModules/mod.js': mod,
 '/Commands/SlashCommands/giveaway/end.js': endGiveaway,
 '/Commands/SlashCommands/reminder/create.js': createReminder,

 // importCache
 importCache,
};
