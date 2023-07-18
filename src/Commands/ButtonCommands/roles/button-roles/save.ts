import * as Discord from 'discord.js';
import * as ch from '../../../../BaseClient/ClientHelper.js';
import refresh from './refresh.js';
import { findField } from '../../../SelectCommands/StringSelect/roles/button-roles.js';
import * as DBT from '../../../../Typings/DataBaseTypings.js';
import { typeWithoutDash } from '../../../SlashCommands/roles/builders/button-roles.js';

export default async (
 cmd: Discord.ButtonInteraction,
 args: string[],
 type: 'reaction-roles' | 'button-roles' = 'button-roles',
) => {
 if (!cmd.inCachedGuild()) return;

 const emoji = args.join('_');
 const language = await ch.languageSelector(cmd.guildId);
 const message = await ch.getMessage(cmd.message.embeds[0].url as string);
 if (!message || message.guildId !== cmd.guildId) {
  ch.errorCmd(cmd, language.errors.messageNotFound, language);
  return;
 }

 const settings =
  (await ch.query(
   `SELECT * FROM ${typeWithoutDash(type)}ettings WHERE guildid = $1 AND msgid = $2;`,
   [cmd.guildId, message.id],
   {
    returnType: type === 'reaction-roles' ? 'reactionrolesettings' : 'buttonrolesettings',
    asArray: false,
   },
  )) ??
  (await ch.query(
   `INSERT INTO ${typeWithoutDash(type)}ettings 
   (uniquetimestamp, active, onlyone, guildid, msgid, channelid) 
   VALUES ($1, true, false, $2, $3, $4) 
   RETURNING *;`,
   [Date.now(), cmd.guildId, message.id, message.channelId],
   {
    returnType: type === 'reaction-roles' ? 'reactionrolesettings' : 'buttonrolesettings',
    asArray: false,
   },
  ));

 if (!settings) {
  ch.error(cmd.guild, new Error('Failed to create settings'));
  return;
 }

 const buttonSettings = await ch.query(
  `SELECT * FROM ${typeWithoutDash(type)} WHERE emote = $1 AND linkedid = $2;`,
  [emoji, settings.uniquetimestamp],
  {
   returnType: typeWithoutDash(type),
   asArray: false,
  },
 );

 const field = findField(emoji, cmd.message.embeds[0].fields);
 const roles = field?.value.split(/,\s+/g).map((r) => r.replace(/\D+/g, '')) ?? [];
 if (buttonSettings) {
  await ch.query(
   `UPDATE ${typeWithoutDash(
    type,
   )} SET active = true, roles = $1 WHERE emote = $2 AND linkedid = $3 RETURNING *;`,
   [roles, emoji, settings.uniquetimestamp],
   { returnType: typeWithoutDash(type), asArray: false },
  );
 } else {
  await ch.query(
   `INSERT INTO ${typeWithoutDash(type)} (uniquetimestamp, guildid, active, emote, roles, linkedid)
   VALUES ($1, $2, true, $3, $4, $5);`,
   [Date.now(), cmd.guildId, emoji, roles, settings.uniquetimestamp],
   { returnType: typeWithoutDash(type), asArray: false },
  );
 }

 const allSettings = await ch.query(
  `SELECT * FROM ${typeWithoutDash(type)} WHERE linkedid = $1;`,
  [settings.uniquetimestamp],
  { returnType: typeWithoutDash(type), asArray: true },
 );

 const action =
  type === 'button-roles'
   ? await putComponents(allSettings as DBT.buttonroles[], message)
   : await putReactions(allSettings as DBT.reactionroles[], message);

 if (type === 'button-roles') {
  await message.reactions.cache
   .get(emoji.includes(':') ? emoji.split(/:/g)[1] : emoji)
   ?.remove()
   .catch(() => undefined);
 }

 const lan = language.slashCommands.roles.builders;

 if (action && 'message' in action && typeof action.message === 'string') {
  ch.errorCmd(cmd, lan.couldntReact, language);
  return;
 }

 refresh(cmd, [], type);
};

export const putComponents = async (
 allSettings: DBT.buttonroles[] | undefined,
 message: Discord.Message,
) => {
 const chunks = allSettings
  ? ch.getChunks(
     allSettings.map(
      (s): Discord.APIButtonComponentWithCustomId => ({
       label: s.text,
       emoji: {
        id: s.emote?.split(/:/g)[1] ?? undefined,
        name: s.emote?.split(/:/g)[0] ?? s.emote,
        animated: s.emote?.startsWith('a:') ?? false,
       },
       custom_id: `roles/button-roles/takeRole_${s.uniquetimestamp}`,
       style: Discord.ButtonStyle.Secondary,
       type: Discord.ComponentType.Button,
      }),
     ),
     5,
    )
  : [];

 const action = await message
  .edit({
   components: chunks.map((c) => ({
    type: Discord.ComponentType.ActionRow,
    components: c,
   })),
  })
  .catch((e) => e as Discord.DiscordAPIError);

 return action;
};

const putReactions = async (
 allSettings: DBT.reactionroles[] | undefined,
 message: Discord.Message,
) => {
 if (!allSettings) return message.reactions.removeAll().catch((e) => e as Discord.DiscordAPIError);

 const firstSetting = allSettings.find(
  (s) =>
   !message.reactions.cache.get(
    (s?.emote.includes(':') ? s.emote.split(/:/g)[1] : s?.emote) as string,
   )?.me,
 );

 const action = await message.reactions.cache
  .get(
   firstSetting?.emote.includes(':')
    ? firstSetting.emote.split(/:/g)[1]
    : (firstSetting?.emote as string),
  )
  ?.react()
  .catch((e) => e as Discord.DiscordAPIError);

 if (action && 'message' in action && typeof action.message === 'string') return action;

 allSettings.forEach((s) => {
  message.react(s.emote.includes(':') ? s.emote.split(/:/g)[1] : (s.emote as string));
 });

 return message;
};
