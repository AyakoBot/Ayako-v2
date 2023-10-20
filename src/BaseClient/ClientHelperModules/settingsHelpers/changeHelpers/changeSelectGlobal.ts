import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/CustomTypings.js';

import getChangeSelectType from '../getChangeSelectType.js';
import getPlaceholder from '../getPlaceholder.js';

export default <T extends keyof CT.SettingsNames>(
 language: CT.Language,
 type: 'channel' | 'role' | 'user' | 'mention' | 'channels' | 'roles' | 'users' | 'mentions',
 fieldName: string,
 settingName: T,
 uniquetimestamp: number | undefined | string,
) => {
 const menu:
  | Discord.APIRoleSelectComponent
  | Discord.APIChannelSelectComponent
  | Discord.APIUserSelectComponent
  | Discord.APIMentionableSelectComponent = {
  min_values: 0,
  max_values: type.includes('s') ? 25 : 1,
  custom_id: `settings/${type}_${fieldName}_${String(settingName)}${
   uniquetimestamp ? `_${uniquetimestamp}` : ''
  }`,
  type: getChangeSelectType(type),
  placeholder: getPlaceholder(type, language),
 };

 if (menu.type === Discord.ComponentType.ChannelSelect) {
  menu.channel_types = [
   Discord.ChannelType.AnnouncementThread,
   Discord.ChannelType.GuildAnnouncement,
   Discord.ChannelType.GuildForum,
   Discord.ChannelType.GuildStageVoice,
   Discord.ChannelType.GuildText,
   Discord.ChannelType.GuildVoice,
   Discord.ChannelType.PrivateThread,
   Discord.ChannelType.PublicThread,
  ];
 }

 return menu;
};
