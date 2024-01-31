/* eslint-disable max-len */
import { Prisma } from '@prisma/client';
import * as Sharding from 'discord-hybrid-sharding';
import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';

import SlashCommands from './importCache/SlashCommands.js';
import Typings from './importCache/Typings.js';
import pack from './importCache/package.js';
import Other from './importCache/BaseClient/Other.js';
import Bot from './importCache/BaseClient/Bot.js';

const self = {
 // Packages
 prisma: Prisma,
 jobs: Jobs,
 discord: Discord,
 sharding: Sharding,

 // File
 SlashCommands,
 Typings,
 package: pack,
 Commands: {
  AutocompleteCommands: {},
  ButtonCommands: {},
  ContextCommands: {},
  ModalCommands: {},
  SelectCommands: {},
  SlashCommands: {},
  StringCommands: {},
 },
 BaseClient: {
  Bot,
  Other,
 },
};

export default self;
