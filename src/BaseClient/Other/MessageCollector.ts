import { EventEmitter } from 'events';
import type * as Discord from 'discord.js';
import ClientEmitter from './ClientEmitter.js';

class MessageCollector extends EventEmitter {
  ended: boolean;
  time: number;
  channel: DDeno.Channel;
  recieved: number;

  constructor(channel: DDeno.Channel, time?: number) {
    super();
    this.channel = channel;
    this.time = time || 60000;
    this.ended = false;
    this.recieved = 0;

    this.handleMessage = this.handleMessage.bind(this);
    this.handleChannelDeletion = this.handleChannelDeletion.bind(this);
    this.handleThreadDeletion = this.handleThreadDeletion.bind(this);
    this.handleGuildDeletion = this.handleGuildDeletion.bind(this);

    setTimeout(() => this.stop('time'), this.time);

    ClientEmitter.incrementMaxListeners();
    ClientEmitter.on('messageCreate', this.handleMessage);
    ClientEmitter.on('channelDelete', this.handleChannelDeletion);
    ClientEmitter.on('threadDelete', this.handleThreadDeletion);
    ClientEmitter.on('guildDelete', this.handleGuildDeletion);

    this.once('end', () => {
      ClientEmitter.removeListener('messageCreate', this.handleMessage);
      ClientEmitter.removeListener('channelDelete', this.handleChannelDeletion);
      ClientEmitter.removeListener('threadDelete', this.handleThreadDeletion);
      ClientEmitter.removeListener('guildDelete', this.handleGuildDeletion);
      ClientEmitter.decrementMaxListeners();
    });
  }

  handleChannelDeletion(channel: DDeno.Channel) {
    if (
      channel.id === this.channel.id ||
      ('parentID' in this.channel && channel.id === this.channel.parentId)
    ) {
      this.stop('channelDelete');
    }
  }

  handleThreadDeletion(thread: DDeno.Channel) {
    if (thread.id === this.channel.id) {
      this.stop('threadDelete');
    }
  }

  handleGuildDeletion(guild: DDeno.Guild) {
    if ('guild' in this.channel && guild.id === this.channel.guildId) {
      this.stop('guildDelete');
    }
  }

  handleMessage(message: DDeno.Message) {
    if (message.channelId === this.channel.id) {
      this.emit('collect', message);
    }
  }

  stop(reason?: string) {
    if (this.ended) return;
    this.ended = true;
    this.emit('end', reason);
  }
}

export default MessageCollector;
