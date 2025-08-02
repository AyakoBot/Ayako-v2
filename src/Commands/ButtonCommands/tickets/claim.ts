import type { ActionRow, ButtonInteraction, MessageActionRowComponent } from 'discord.js';

export default async (cmd: ButtonInteraction, args: string[]) => {
 if (!cmd.inCachedGuild()) return;
 if (!cmd.channel) return;

 const language = await cmd.client.util.getLanguage(cmd.locale);
 const id = args.shift() as string;
 const creatorId = args.shift() as string;

 if (cmd.channel.name.startsWith(`${language.ticketing.closed}-`)) {
  cmd.client.util.errorCmd(cmd, language.ticketing.alreadyClosed, language);
  return;
 }

 if (!id || !creatorId) {
  cmd.client.util.errorCmd(cmd, language.ticketing.notFound, language);
  return;
 }

 if (creatorId === cmd.user.id) {
  cmd.client.util.errorCmd(cmd, language.ticketing.cantClaim, language);
  return;
 }

 cmd.client.util.request.channels.edit(cmd.channel, {
  name: `${language.ticketing.claimed}-${cmd.channel.name}`.slice(0, 30),
 });

 cmd.update({
  content: `${language.ticketing.claimedBy}: ${cmd.user}`,
  components: (cmd.message.components as ActionRow<MessageActionRowComponent>[]).map((row) => ({
   type: row.type,
   components: row.components.map((btn) => ({
    ...btn.toJSON(),
    disabled: 'customId' in btn && btn.customId?.startsWith('tickets/claim_') ? true : btn.disabled,
   })),
  })),
 });

 const settings = await cmd.client.util.DataBase.ticketing.findUnique({
  where: { uniquetimestamp: id, active: true },
 });
 if (!settings) return;

 cmd.client.util.send(
  { id: settings.logChannelIds, guildId: cmd.guildId },
  {
   embeds: [
    {
     title: language.ticketing.logs.authorClaimed,
     description: language.ticketing.logs.descClaimed(cmd.user, cmd.channel),
     color: cmd.client.util.Colors.Success,
    },
   ],
  },
 );
};
