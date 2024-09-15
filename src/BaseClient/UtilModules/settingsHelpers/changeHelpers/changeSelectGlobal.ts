import * as Discord from 'discord.js';
import * as CT from '../../../../Typings/Typings.js';

import getChangeSelectType from '../getChangeSelectType.js';
import getPlaceholder from '../getPlaceholder.js';
import { getWithUTS } from '../buttonParsers/back.js';

export default <T extends keyof typeof CT.SettingsName2TableName>(
 language: CT.Language,
 type: CT.ChangeSelectType,
 fieldName: string,
 settingName: T,
 uniquetimestamp: number | undefined | string,
 values: {
  id: string;
  type: Discord.SelectMenuDefaultValueType;
 }[],
 channelType?: 'text' | 'voice' | 'category',
) => {
 const menu:
  | Discord.APIRoleSelectComponent
  | Discord.APIChannelSelectComponent
  | Discord.APIUserSelectComponent
  | Discord.APIMentionableSelectComponent = {
  min_values: 0,
  max_values: type.endsWith('s') ? 25 : 1,
  custom_id: getWithUTS(`settings/${type}_${fieldName}_${String(settingName)}`, uniquetimestamp),
  default_values: values as never,
  type: getChangeSelectType(type),
  placeholder: getPlaceholder(type, language),
 };

 if (menu.type === Discord.ComponentType.ChannelSelect) {
  switch (channelType) {
   case 'voice': {
    menu.channel_types = [Discord.ChannelType.GuildVoice, Discord.ChannelType.GuildStageVoice];
    break;
   }
   case 'category': {
    menu.channel_types = [Discord.ChannelType.GuildCategory];
    break;
   }
   default: {
    menu.channel_types = [
     Discord.ChannelType.AnnouncementThread,
     Discord.ChannelType.GuildAnnouncement,
     Discord.ChannelType.GuildForum,
     Discord.ChannelType.GuildStageVoice,
     Discord.ChannelType.GuildText,
     Discord.ChannelType.GuildVoice,
     Discord.ChannelType.PrivateThread,
     Discord.ChannelType.PublicThread,
     Discord.ChannelType.GuildMedia,
    ];
    break;
   }
  }
 }

 return menu;
};
