import { LevelUpMode } from '@prisma/client';
import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';

const name = CT.SettingNames.Leveling;

export default async (cmd: Discord.ButtonInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await client.util.getLanguage(cmd.guild.id);
 const lan = language.slashCommands.settings.categories[name];
 const { embedParsers, buttonParsers } = client.util.settingsHelpers;
 const settings = await client.util.DataBase[CT.SettingsName2TableName[name]]
  .findUnique({ where: { guildid: cmd.guildId } })
  .then(
   (r) =>
    r ??
    client.util.DataBase[CT.SettingsName2TableName[name]].create({
     data: { guildid: cmd.guildId },
    }),
  );

 cmd.update({
  embeds: await getEmbeds(embedParsers, settings, language, lan, cmd.guild),
  components: await getComponents(buttonParsers, settings, language),
 });
};

const getLevelUpMode = (type: LevelUpMode, language: CT.Language) => {
 switch (type) {
  case 'messages':
   return language.lvlupmodes.messages;
  case 'reactions':
   return language.lvlupmodes.reactions;
  default:
   return language.lvlupmodes.silent;
 }
};

export const getEmbeds: CT.SettingsFile<typeof name>['getEmbeds'] = async (
 embedParsers,
 settings,
 language,
 lan,
) => {
 const embeds: Discord.APIEmbed[] = [
  {
   author: embedParsers.author(language, lan),
   fields: [
    {
     name: lan.fields.lvlupmode.name,
     value: getLevelUpMode(settings.lvlupmode, language),
     inline: false,
    },
   ],
  },
 ];

 switch (settings.lvlupmode) {
  case 'messages': {
   embeds[0].fields?.push(
    {
     name: lan.fields.embed.name,
     value: await embedParsers.embed(settings.embed, language),
     inline: true,
    },
    {
     name: lan.fields.lvlupdeltimeout.name,
     value: embedParsers.time(Number(settings.lvlupdeltimeout) * 1000, language),
     inline: true,
    },
    {
     name: lan.fields.pingUser.name,
     value: embedParsers.boolean(settings.pingUser, language),
     inline: true,
    },
    {
     name: lan.fields.lvlupchannels.name,
     value: embedParsers.channels(settings.lvlupchannels, language),
     inline: false,
    },
   );

   break;
  }
  case 'reactions': {
   embeds[0].fields?.push(
    {
     name: lan.fields.lvlupemotes.name,
     value: (settings.lvlupemotes?.length
      ? (await Promise.all(settings.lvlupemotes.map((e) => client.util.getEmote(e)))).filter(
         (e): e is Discord.GuildEmoji => !!e,
        )
      : client.util.emotes.levelupemotes
     )
      .map((e) => client.util.constants.standard.getEmote(e))
      .join(', '),
     inline: true,
    },
    {
     name: lan.fields.lvlupdeltimeout.name,
     value: embedParsers.time(Number(settings.lvlupdeltimeout) * 1000, language),
     inline: true,
    },
    {
     name: lan.fields.lvluptext.name,
     value: embedParsers.string(settings.lvluptext || language.t.Default, language),
     inline: true,
    },
   );
   break;
  }
  default: {
   break;
  }
 }

 return embeds;
};

export const getComponents: CT.SettingsFile<typeof name>['getComponents'] = (
 buttonParsers,
 settings,
 language,
) => {
 const components: Discord.APIActionRowComponent<Discord.APIComponentInMessageActionRow>[] = [
  {
   type: Discord.ComponentType.ActionRow,
   components: [buttonParsers.specific(language, settings.lvlupmode, 'lvlupmode', name, undefined)],
  },
  {
   type: Discord.ComponentType.ActionRow,
   components: [],
  },
  {
   type: Discord.ComponentType.ActionRow,
   components: [buttonParsers.back(name, undefined)],
  },
 ];

 switch (settings.lvlupmode) {
  case 'messages': {
   components[1].components.push(
    buttonParsers.specific(language, settings.embed, 'embed', name, undefined),
    buttonParsers.specific(language, settings.lvlupdeltimeout, 'lvlupdeltimeout', name, undefined),
    buttonParsers.specific(language, settings.pingUser, 'pingUser', name, undefined),
    buttonParsers.specific(
     language,
     settings.lvlupchannels,
     'lvlupchannels',
     name,
     undefined,
     CT.EditorTypes.Channel,
    ),
   );
   break;
  }
  case 'reactions': {
   components[1].components.push(
    buttonParsers.specific(language, settings.lvlupemotes, 'lvlupemotes', name, undefined),
    buttonParsers.specific(language, settings.lvlupdeltimeout, 'lvlupdeltimeout', name, undefined),
    buttonParsers.specific(language, settings.lvluptext, 'lvluptext', name, undefined),
   );
   break;
  }
  default: {
   break;
  }
 }

 return components.filter((c) => c.components.length);
};
