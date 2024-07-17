import * as Discord from 'discord.js';
import gifSelection, { ReturnType } from './cache/bot/gifs.js';
import objectEmotes from './emotes.js';
import getBotMemberFromGuild from './getBotMemberFromGuild.js';
import getColor from './getColor.js';
import getLanguage from './getLanguage.js';
import replyCmd from './replyCmd.js';

/**
 * Retrieves a GIF image based on the provided command name
 * and sends it as an embed message with buttons to refresh and view artist/original source.
 * @param cmd - The chat input command or button interaction that triggered the function.
 * @returns A Promise that resolves with the sent message.
 */
export const imageGetter = async (
 cmd: Discord.ChatInputCommandInteraction | Discord.ButtonInteraction,
) => {
 const commandName =
  cmd instanceof Discord.ChatInputCommandInteraction
   ? cmd.options.data.find((c) => c.type === Discord.ApplicationCommandOptionType.Subcommand)?.name
   : cmd.customId.split(/\//g)[1];
 if (!commandName) return;

 const ephemeral =
  cmd instanceof Discord.ChatInputCommandInteraction
   ? cmd.options.getBoolean('hide', false) ?? true
   : true;
 const imgGetter = gifSelection.find((g) => g.triggers.includes(commandName));
 const img = (await imgGetter?.gifs()) as ReturnType<'img'>;
 const language = await getLanguage(cmd.guildId);
 const lan = language.slashCommands.img;

 const payload = {
  ephemeral,
  embeds: [
   {
    image: { url: img.url },
    color: cmd.guild ? getColor(await getBotMemberFromGuild(cmd.guild)) : undefined,
    author: img.artist ? { name: lan.madeBy } : undefined,
    title: img.artist as string,
    url: img.source as string,
   },
  ],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      label: language.t.Refresh,
      custom_id: `images/${commandName}`,
      style: Discord.ButtonStyle.Primary,
      emoji: objectEmotes.refresh,
     } as Discord.APIButtonComponent,
    ],
   } as Discord.APIActionRowComponent<Discord.APIButtonComponent>,
   img.source
    ? ({
       type: Discord.ComponentType.ActionRow,
       components: [
        {
         type: Discord.ComponentType.Button,
         label: lan.viewArtist,
         style: Discord.ButtonStyle.Link,
         url: img.artistUrl as string,
        } as Discord.APIButtonComponent,
        {
         type: Discord.ComponentType.Button,
         label: lan.viewOriginal,
         style: Discord.ButtonStyle.Link,
         url: img.source as string,
        } as Discord.APIButtonComponent,
       ],
      } as Discord.APIActionRowComponent<Discord.APIButtonComponent>)
    : undefined,
  ].filter((c): c is Discord.APIActionRowComponent<Discord.APIButtonComponent> => !!c),
 };

 if (cmd instanceof Discord.ChatInputCommandInteraction) replyCmd(cmd, payload);
 else cmd.update(payload);
};
