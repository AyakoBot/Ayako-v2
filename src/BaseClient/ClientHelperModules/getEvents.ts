import glob from 'glob';

export const gatewayEvents = [
  'applicationCommandPermissionsUpdate',
  'autoModerationActionExecution',
  'autoModerationRuleCreate',
  'autoModerationRuleDelete',
  'autoModerationRuleUpdate',
  'channelCreate',
  'channelDelete',
  'channelPinsCreate',
  'channelPinsDelete',
  'channelPinsUpdate',
  'channelUpdate',
  'debug',
  'emojiCreate',
  'emojiDelete',
  'emojiUpdate',
  'error',
  'guildBanAdd',
  'guildBanRemove',
  'guildCreate',
  'guildDelete',
  'guildIntegrationsCreates',
  'guildIntegrationsDeletes',
  'guildIntegrationsUpdate',
  'guildIntegrationsUpdates',
  'guildMemberAdd',
  'guildMemberRemove',
  'guildMemberUpdate',
  'guildScheduledEventCreate',
  'guildScheduledEventDelete',
  'guildScheduledEventUpdate',
  'guildScheduledEventUserAdd',
  'guildScheduledEventUserRemove',
  'guildUpdate',
  'interactionCreate',
  'inviteCreate',
  'inviteDelete',
  'messageCreate',
  'messageDelete',
  'messageDeleteBulk',
  'messageReactionAdd',
  'messageReactionRemove',
  'messageReactionRemoveAll',
  'messageReactionRemoveEmoji',
  'messageUpdate',
  'modBaseEvent',
  'modSourceHandler',
  'ready',
  'roleCreate',
  'roleDelete',
  'roleUpdate',
  'stageInstanceCreate',
  'stageInstanceDelete',
  'stageInstanceUpdate',
  'stickerCreate',
  'stickerDelete',
  'stickerUpdate',
  'threadCreate',
  'threadDelete',
  'threadMembersUpdate',
  'threadUpdate',
  'typingStart',
  'uncaughtException',
  'unhandledRejection',
  'userUpdate',
  'voiceStateCreates',
  'voiceStateDeletes',
  'voiceStateUpdate',
  'voiceStateUpdates',
  'voteBotCreate',
  'voteGuildCreate',
  'webhooksCreate',
  'webhooksDelete',
  'webhooksUpdate',
];

export default async (): Promise<typeof gatewayEvents> => {
  const events: string[] = await new Promise((resolve) => {
    glob(`${process.cwd()}/Events/**/*`, (err, res) => {
      if (err) throw err;
      resolve(res);
    });
  });

  const filteredEvents = events
    .filter((path) => path.endsWith('.js'))
    .filter((path) => {
      const eventName = path.replace('.js', '').split(/\/+/).pop();

      if (!eventName) return false;
      if (!gatewayEvents.includes(eventName)) return false;
      return true;
    });

  return filteredEvents;
};
