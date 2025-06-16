import type { GuildBasedChannel } from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';
import type { AppealStatus, StoredPunishmentTypes } from '@prisma/client';

export default (t: CT.Language) => ({
 ...t.JSON.slashCommands.appeal,
 punInfo: (
  reason: string,
  type: StoredPunishmentTypes,
  date: number,
  channel: GuildBasedChannel | { id: string; name: string },
  status: AppealStatus | null,
  decisionReason: string | null,
 ) =>
  t.stp(t.JSON.slashCommands.appeal.punInfo, {
   reason,
   type: t.punishments[type as keyof typeof t.punishments],
   date: t.util.constants.standard.getTime(date),
   channel: t.languageFunction.getChannel(
    channel,
    'type' in channel ? t.channelTypes[channel.type as keyof typeof t.channelTypes] : undefined,
   ),
   status: status
    ? t.slashCommands.appeal.appealStatus[
       status as keyof typeof t.slashCommands.appeal.appealStatus
      ]
    : t.slashCommands.appeal.appealStatus.unsent,
   decisionReason: decisionReason || '-',
  }),
});
