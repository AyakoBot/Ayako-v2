import * as Discord from 'discord.js';
import * as CT from '../../../Typings/Typings.js';
import { EmbedFields } from '../../../BaseClient/Other/constants/customEmbeds.js';

export default async (
 cmd:
  | Discord.ButtonInteraction
  | Discord.ModalMessageModalSubmitInteraction
  | Discord.StringSelectMenuInteraction
  | Discord.Message<true>,
 _: string[],
 embed?: Discord.APIEmbed,
 selectedField?: number | null,
 selectedEmbedProp?: EmbedFields,
) => {
 if (!(cmd instanceof Discord.Message) && !cmd.inCachedGuild()) return;
 if (!cmd.channel) return;
 if (Number.isNaN(selectedField)) selectedField = null;

 const inThread = [
  Discord.ChannelType.PublicThread,
  Discord.ChannelType.AnnouncementThread,
  Discord.ChannelType.PrivateThread,
 ].includes(cmd.channel.type);

 const author =
  cmd instanceof Discord.Message
   ? await cmd.client.util.getUser(
      new URL(cmd.embeds[0].url ?? 'https://ayakobot.com').searchParams.get('exec') ?? '',
     )
   : cmd.user;
 if (!author) return;

 const getThread = async () => {
  const t = inThread
   ? cmd.channel!
   : await cmd.client.util.request.channels.createThread(cmd.channel!, {
      name: author.username,
     });

  if (cmd instanceof Discord.Message) {
   return t;
  }

  if ('message' in t) {
   cmd.client.util.replyCmd(cmd, { content: t.message });
   return undefined;
  }

  if (!inThread) {
   await cmd.deferUpdate();
   cmd.deleteReply();
  }

  return t;
 };

 const thread = await getThread();
 if (!thread || 'message' in thread) return;

 const language = await cmd.client.util.getLanguage(cmd.guildId);
 const lan = language.slashCommands.embedbuilder.create;
 let canFinish = true;

 if (
  !embed?.description &&
  !embed?.fields?.length &&
  !embed?.title &&
  !embed?.footer?.text &&
  !embed?.image?.url &&
  !embed?.thumbnail?.url &&
  !embed?.author?.name
 ) {
  embed = { description: lan.yourEmbed };

  canFinish = false;
 }

 const options: Discord.APISelectMenuOption[] = embed.fields?.length
  ? embed.fields?.map((_1, i) => ({
     label: lan.start['field-nr'](String(i + 1)),
     value: String(i),
     default: i === selectedField,
    }))
  : [];

 if (options.length < 25) {
  options.push({
   label: lan.start.createButtons.addField,
   value: 'create',
   emoji: cmd.client.util.emotes.plusBG,
  });
 }

 const payload: CT.UsualMessagePayload = {
  content: author.toString(),
  allowed_mentions: { users: [author.id] },
  embeds: [
   {
    url: `https://ayakobot.com?isEmbedBuilder=true&exec=${author.id}`,
    color: cmd.client.util.getColor(
     cmd.guild ? await cmd.client.util.getBotMemberFromGuild(cmd.guild) : undefined,
    ),
    description: `${lan.desc}\n\n${
     lan.oneRequired
    }\n${cmd.client.util.constants.customembeds.needsOneOf
     .map((n) => lan.embedProperties[n as keyof typeof lan.embedProperties])
     .filter((a): a is string => !!a)
     .join(', ')}`,
    fields: [
     ...lan
      .fields((await cmd.client.util.getCustomCommand(cmd.guild, 'stp'))?.id ?? '0')
      .map((f) => ({ name: '\u200b', value: `${lan.quick}\n${f}`, inline: false })),
     {
      name: '\u200b',
      value: cmd.client.util.makeTable([
       ['', lan.start.sendMessage.acceptsEmojis, lan.start.sendMessage.acceptsMentions],
       [lan.start.createButtons.selectMenu.title, language.t.Yes, language.t.No],
       [lan.start.createButtons.selectMenu.description, language.t.Yes, language.t.Yes],
       [lan.start.createButtons.fieldButtons['field-name'], language.t.Yes, language.t.No],
       [lan.start.createButtons.fieldButtons['field-value'], language.t.Yes, language.t.Yes],
      ]),
     },
    ],
   },
   embed,
  ],
  components: [
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.StringSelect,
      placeholder:
       typeof selectedField === 'number'
        ? lan.start.selectFieldPlaceholder
        : lan.start.selectPlaceholder,
      max_values: 1,
      min_values: 1,
      custom_id: 'embed-builder/create/select',
      options:
       typeof selectedField === 'number'
        ? [
           {
            label: lan.start.createButtons.fieldButtons[EmbedFields.FieldName],
            value: `${cmd.client.util.constants.customembeds.type[EmbedFields.FieldName]}_${
             EmbedFields.FieldName
            }`,
            default: selectedEmbedProp === EmbedFields.FieldName,
           },
           {
            label: lan.start.createButtons.fieldButtons[EmbedFields.FieldValue],
            value: `${cmd.client.util.constants.customembeds.type[EmbedFields.FieldValue]}_${
             EmbedFields.FieldValue
            }`,
            default: selectedEmbedProp === EmbedFields.FieldValue,
           },
           {
            label: lan.start.createButtons.fieldButtons[EmbedFields.FieldInline],
            value: `${cmd.client.util.constants.customembeds.type[EmbedFields.FieldInline]}_${
             EmbedFields.FieldInline
            }`,
            default: selectedEmbedProp === EmbedFields.FieldInline,
           },
           {
            label: lan.start.createButtons.removeField,
            value: 'remove-field',
           },
          ]
        : Object.entries(lan.start.createButtons.selectMenu).map(([k, v]) => ({
           default: k === selectedEmbedProp,
           label: v,
           value: `${
            cmd.client.util.constants.customembeds.type[
             k as keyof typeof cmd.client.util.constants.customembeds.type
            ]
           }_${k}`,
          })),
     },
    ],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.StringSelect,
      placeholder: lan.start.fieldPlaceholder,
      max_values: 1,
      min_values: 0,
      custom_id: 'embed-builder/create/fields',
      options,
     },
    ],
   },
   {
    type: Discord.ComponentType.ActionRow,
    components: [
     {
      type: Discord.ComponentType.Button,
      label: lan.start.createButtons.save,
      style: Discord.ButtonStyle.Success,
      custom_id: 'embed-builder/save',
      disabled:
       !canFinish ||
       !(cmd instanceof Discord.Message ? cmd.member?.permissions : cmd.memberPermissions)?.has(
        Discord.PermissionsBitField.Flags.ManageGuild,
       ),
     },
     {
      type: Discord.ComponentType.Button,
      label: lan.start.createButtons.send,
      style: Discord.ButtonStyle.Success,
      custom_id: 'embed-builder/send',
      disabled:
       !canFinish ||
       !(cmd instanceof Discord.Message ? cmd.member?.permissions : cmd.memberPermissions)?.has(
        Discord.PermissionsBitField.Flags.ManageGuild,
       ),
     },
     {
      type: Discord.ComponentType.Button,
      label: lan.start.createButtons.edit,
      style: Discord.ButtonStyle.Success,
      custom_id: 'embed-builder/edit',
      disabled:
       !canFinish ||
       !(cmd instanceof Discord.Message ? cmd.member?.permissions : cmd.memberPermissions)?.has(
        Discord.PermissionsBitField.Flags.ManageGuild,
       ),
     },
     {
      type: Discord.ComponentType.Button,
      label: language.t.Delete,
      style: Discord.ButtonStyle.Danger,
      custom_id: `deleteThread_${author.id}`,
     },
    ],
   },
  ],
 };

 if (cmd instanceof Discord.Message) {
  cmd.client.util.request.channels.editMsg(cmd, payload as Omit<CT.UsualMessagePayload, 'files'>);
  return;
 }

 if (inThread) await cmd.update(payload);
 else cmd.client.util.send(thread, payload);
};
