import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import log from './log.js';

export default async (
 oldStage: Discord.StageInstance | undefined,
 stage: Discord.StageInstance,
) => {
 if (!oldStage) return;
 if (!stage.guild) return;

 await ch.firstGuildInteraction(stage.guild);

 log(oldStage, stage);
};
