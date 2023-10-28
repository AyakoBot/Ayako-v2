import type * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import type CT from '../../../../Typings/CustomTypings.js';

type Type = 'shoptype' | 'punishment' | 'language' | 'auto-punishment';

export default async (
 cmd: Discord.StringSelectMenuInteraction,
 args: string[],
 type: Type = 'shoptype',
) => {
 if (!cmd.inCachedGuild()) return;

 const fieldName = args.shift();
 if (!fieldName) return;

 const settingName = args.shift() as keyof CT.Language['slashCommands']['settings']['categories'];
 if (!settingName) return;

 const language = await ch.getLanguage(cmd.guildId);

 console.log(cmd.values);

 cmd.update({
  embeds: [
   await ch.settingsHelpers.changeHelpers.changeEmbed(
    language,
    settingName,
    fieldName,
    cmd.values,
    type,
    cmd.guild,
   ),
  ],
 });
};
