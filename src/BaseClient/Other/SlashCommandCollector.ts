import { EventEmitter } from 'events';
import type * as Discord from 'discord.js';
import client from '../Client.js';

class SlashCommandCollector extends EventEmitter {
  ended: boolean;
  time: number;
  channel: Discord.Channel;
  recieved: number;

  constructor(channel: Discord.Channel, time?: number) {
    super();
    this.channel = channel;
    this.time = time || 60000;
    this.ended = false;
    this.recieved = 0;

    this.handleSlashCommand = this.handleSlashCommand.bind(this);
    this.handleChannelDeletion = this.handleChannelDeletion.bind(this);
    this.handleThreadDeletion = this.handleThreadDeletion.bind(this);
    this.handleGuildDeletion = this.handleGuildDeletion.bind(this);

    setTimeout(() => this.stop('time'), this.time);

    const incrementListeners = this.getMaxListeners();
    if (incrementListeners !== 0) {
      this.setMaxListeners(incrementListeners + 1);
    }

    client.on('interactionCreate', this.handleSlashCommand);
    client.on('channelDelete', this.handleChannelDeletion);
    client.on('threadDelete', this.handleThreadDeletion);
    client.on('guildDelete', this.handleGuildDeletion);

    this.once('end', () => {
      client.removeListener('interactionCreate', this.handleSlashCommand);
      client.removeListener('channelDelete', this.handleChannelDeletion);
      client.removeListener('threadDelete', this.handleThreadDeletion);
      client.removeListener('guildDelete', this.handleGuildDeletion);

      const decrementListeners = this.getMaxListeners();
      if (decrementListeners !== 0) {
        this.setMaxListeners(decrementListeners - 1);
      }
    });
  }

  handleChannelDeletion(channel: Discord.Channel) {
    if (
      channel.id === this.channel.id ||
      ('parentID' in this.channel && channel.id === this.channel.parentID)
    ) {
      this.stop('channelDelete');
    }
  }

  handleThreadDeletion(thread: Discord.Channel) {
    if (thread.id === this.channel.id) {
      this.stop('threadDelete');
    }
  }

  handleGuildDeletion(guild: Discord.Guild) {
    if ('guild' in this.channel && guild.id === this.channel.guildId) {
      this.stop('guildDelete');
    }
  }

  handleSlashCommand(interaction: Discord.Interaction) {
    if (interaction.type !== 2) return;
    if (interaction.channelId === this.channel.id) {
      this.emit('collect', interaction);
    }
  }

  stop(reason?: string) {
    if (this.ended) return;
    this.ended = true;
    this.emit('end', reason);
  }
}

export default SlashCommandCollector;
