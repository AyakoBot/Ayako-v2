/* eslint-disable max-len */
import { Prisma } from '@prisma/client';
import * as Sharding from 'discord-hybrid-sharding';
import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';

const self = {
 // Packages
 prisma: Prisma,
 jobs: Jobs,
 discord: Discord,
 sharding: Sharding,
};

export default self;
