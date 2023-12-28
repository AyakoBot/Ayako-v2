import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';

import log from './log.js';

export default async (stage: Discord.StageInstance) => {
 if (!stage.guild) return;

 await ch.firstGuildInteraction(stage.guild);

 log(stage);
};
