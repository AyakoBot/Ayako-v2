import { LevelUpMode } from '@prisma/client';
import * as Discord from 'discord.js';
import client from '../../../../BaseClient/Bot/Client.js';
import * as CT from '../../../../Typings/Typings.js';

const name = CT.SettingNames.Leveling;

export default async (cmd: Discord.ChatInputCommandInteraction) => {
 if (!cmd.inCachedGuild()) return;

 const language = await client.util.getLanguage(cmd.guild?.id);
 const lan = language.slashCommands.settings.categories[name];
 const { embedParsers, buttonParsers } = client.util.settingsHelpers;
 const settings = await client.util.DataBase[CT.SettingsName2TableName[name]]
  .findUnique({
   where: { guildid: cmd.guildId },
  })
  .then(
   (r) =>
    r ??
    client.util.DataBase[CT.SettingsName2TableName[name]].create({
     data: { guildid: cmd.guildId },
    }),
  );

 cmd.reply({
  embeds: await getEmbeds(embedParsers, settings, language, lan, cmd.guild),
  components: await getComponents(buttonParsers, settings, language),
  ephemeral: true,
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
   description: client.util.constants.tutorials[
    name as keyof typeof client.util.constants.tutorials
   ]?.length
    ? `${language.slashCommands.settings.tutorial}\n${client.util.constants.tutorials[
       name as keyof typeof client.util.constants.tutorials
      ].map((t) => `[${t.name}](${t.link})`)}`
    : undefined,
   fields: [
    {
     name: language.slashCommands.settings.active,
     value: embedParsers.boolean(settings.active, language),
     inline: false,
    },
    {
     name: lan.fields.xppermsg.name,
     value: embedParsers.number(settings.xppermsg, language),
     inline: true,
    },
    {
     name: lan.fields.xpmultiplier.name,
     value: embedParsers.number(settings.xpmultiplier ?? 1, language),
     inline: true,
    },
    {
     name: lan.fields.rolemode.name,
     value: settings.rolemode ? language.rolemodes.replace : language.rolemodes.stack,
     inline: true,
    },
    {
     name: lan.fields.lvlupmode.name,
     value: getLevelUpMode(settings.lvlupmode, language),
     inline: true,
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
     value: embedParsers.time(Number(settings.lvlupdeltimeout), language),
     inline: true,
    },
   );
   break;
  }
  default: {
   break;
  }
 }

 embeds[0].fields?.push(
  {
   name: lan.fields.ignoreprefixes.name,
   value: embedParsers.boolean(settings.ignoreprefixes, language),
   inline: true,
  },
  {
   name: lan.fields.prefixes.name,
   value: settings.prefixes?.length
    ? settings.prefixes.map((p) => `\`${p}\``).join(', ')
    : language.t.None,
   inline: true,
  },
  {
   name: lan.fields.minwords.name,
   value: embedParsers.number(settings.minwords, language),
   inline: true,
  },
  {
   name: language.slashCommands.settings.BLWL.blchannelid,
   value: embedParsers.channels(settings.blchannelid, language),
   inline: false,
  },
  {
   name: language.slashCommands.settings.BLWL.wlchannelid,
   value: embedParsers.channels(settings.wlchannelid, language),
   inline: false,
  },
  {
   name: language.slashCommands.settings.BLWL.blroleid,
   value: embedParsers.channels(settings.blroleid, language),
   inline: false,
  },
  {
   name: language.slashCommands.settings.BLWL.wlroleid,
   value: embedParsers.channels(settings.wlroleid, language),
   inline: false,
  },
  {
   name: language.slashCommands.settings.BLWL.bluserid,
   value: embedParsers.channels(settings.bluserid, language),
   inline: false,
  },
  {
   name: language.slashCommands.settings.BLWL.wluserid,
   value: embedParsers.channels(settings.wluserid, language),
   inline: false,
  },
 );

 return embeds;
};

export const getComponents: CT.SettingsFile<typeof name>['getComponents'] = (
 buttonParsers,
 settings,
 language,
) => {
 const components: Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] = [
  {
   type: Discord.ComponentType.ActionRow,
   components: [
    buttonParsers.global(language, !!settings.active, CT.GlobalDescType.Active, name, undefined),
   ],
  },
  {
   type: Discord.ComponentType.ActionRow,
   components: [
    buttonParsers.specific(language, settings.xppermsg, 'xppermsg', name, undefined),
    buttonParsers.specific(language, settings.xpmultiplier, 'xpmultiplier', name, undefined),
    buttonParsers.specific(language, settings.rolemode, CT.EditorTypes.RoleMode, name, undefined),
   ],
  },
  {
   type: Discord.ComponentType.ActionRow,
   components: [buttonParsers.specific(language, settings.lvlupmode, 'lvlupmode', name, undefined)],
  },
  {
   type: Discord.ComponentType.ActionRow,
   components: [
    buttonParsers.boolean(language, settings.ignoreprefixes, 'ignoreprefixes', name, undefined),
    buttonParsers.specific(language, settings.prefixes, 'prefixes', name, undefined),
    buttonParsers.specific(language, settings.minwords, 'minwords', name, undefined),
    buttonParsers.global(
     language,
     settings.blchannelid,
     CT.GlobalDescType.BLChannelId,
     name,
     undefined,
    ),
   ],
  },
  {
   type: Discord.ComponentType.ActionRow,
   components: [
    buttonParsers.global(language, settings.blroleid, CT.GlobalDescType.BLRoleId, name, undefined),
    buttonParsers.global(language, settings.bluserid, CT.GlobalDescType.BLUserId, name, undefined),
    buttonParsers.global(
     language,
     settings.wlchannelid,
     CT.GlobalDescType.WLChannelId,
     name,
     undefined,
    ),
    buttonParsers.global(language, settings.wlroleid, CT.GlobalDescType.WLRoleId, name, undefined),
    buttonParsers.global(language, settings.wluserid, CT.GlobalDescType.WLUserId, name, undefined),
   ],
  },
 ];

 switch (settings.lvlupmode) {
  case 'messages': {
   components[2].components.push(
    buttonParsers.specific(language, settings.embed, 'embed', name, undefined),
    buttonParsers.specific(language, settings.lvlupdeltimeout, 'lvlupdeltimeout', name, undefined),
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
   components[2].components.push(
    buttonParsers.specific(language, settings.lvlupemotes, 'lvlupemotes', name, undefined),
    buttonParsers.specific(language, settings.lvlupdeltimeout, 'lvlupdeltimeout', name, undefined),
   );
   break;
  }
  default: {
   break;
  }
 }

 return components;
};
