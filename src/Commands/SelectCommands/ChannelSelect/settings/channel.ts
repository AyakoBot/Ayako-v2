import type * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type CT from '../../../../Typings/CustomTypings.js';

export default async (cmd: Discord.ChannelSelectMenuInteraction, args: string[]) => {
 const fieldName = args.shift();
 if (!fieldName) return;

 const settingName = args.shift() as keyof CT.Language['slashCommands']['settings']['categories'];
 if (!settingName) return;

 const language = await ch.languageSelector(cmd.guildId);

 cmd.update({
  embeds: [
   await ch.settingsHelpers.changeHelpers.changeEmbed(
    language,
    settingName,
    fieldName,
    cmd.channels.map((c) => c.id),
    'channel',
   ),
  ],
 });
};
