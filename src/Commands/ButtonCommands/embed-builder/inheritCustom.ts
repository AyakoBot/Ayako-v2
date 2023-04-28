import type * as Discord from 'discord.js';
import * as ch from '../../../BaseClient/ClientHelper.js';
import startOver from './startOver.js';
import { getSelectedField } from './deleteCustom.js'

export default async (cmd: Discord.ButtonInteraction) => {
 const selectedOption = getSelectedField(cmd)?.value;
 if (!selectedOption) return;

 const dbEmbed = await ch.getEmbed(Number(selectedOption));
 if (!dbEmbed) return;

 const embed = ch.getDiscordEmbed(dbEmbed);

 startOver(cmd, [], embed);
};

