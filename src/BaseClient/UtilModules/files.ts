import { Prisma } from '@prisma/client';
import * as endGiveaway from '../../Commands/SlashCommands/giveaway/end.js';
import * as createReminder from '../../Commands/SlashCommands/reminder/create.js';
import * as separator from '../../Events/guildEvents/guildMemberUpdate/separator.js';
import voteBotCreate from '../../Events/voteEvents/voteBotEvents/voteBotCreate.js';
import voteGuildCreate from '../../Events/voteEvents/voteGuildEvents/voteGuildCreate.js';
import * as typings from '../../Typings/Typings.js';
import constants from '../Other/constants.js';
import * as requestHandler from './requestHandler.js';
import mod from './mod.js';

export default {
 // Packages
 prisma: Prisma,

 // Files
 '/Events/guildEvents/guildMemberUpdate/separator.js': separator,
 '/Events/voteEvents/voteBotEvents/voteBotCreate.js': voteBotCreate,
 '/Events/voteEvents/voteGuildEvents/voteGuildCreate.js': voteGuildCreate,
 '/Typings/Typings.js': typings,
 '/BaseClient/Other/constants.js': constants,
 '/BaseClient/UtilModules/requestHandler.js': requestHandler,
 '/BaseClient/UtilModules/mod.js': mod,
 '/Commands/SlashCommands/giveaway/end.js': endGiveaway,
 '/Commands/SlashCommands/reminder/create.js': createReminder,
};
