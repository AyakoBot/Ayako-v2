import * as Discord from 'discord.js';
import memWatch from '../../../../BaseClient/UtilModules/memWatch.js';
import memAnalyze from '../../../../BaseClient/UtilModules/memAnalyze.js';

export default async (msg: Discord.Message) => {
 if (msg.author.id !== process.env.ownerId) return;
 if (!msg.content.startsWith('mem')) return;

 const m = await msg.reply({ content: 'analyzing memory usage...' });

 try {
  const percentUsed = memWatch(msg.client);

  const embed = new Discord.EmbedBuilder()
   .setTitle('🔍 Memory Analysis')
   .setColor(percentUsed > 80 ? 0xff0000 : percentUsed > 60 ? 0xffa500 : 0x00ff00)
   .addFields(
    {
     name: 'Shard Information',
     value: [
      `**Shard ID:** ${msg.client.cluster?.id ?? 'Unknown'}`,
      `**Memory Usage:** ${percentUsed.toFixed(1)}%`,
      `**Status:** ${percentUsed > 80 ? '🚨 Critical' : percentUsed > 60 ? '⚠️ Warning' : '✅ Normal'}`,
     ].join('\n'),
     inline: true,
    },
    {
     name: 'Cache Statistics',
     value: [
      `**Guilds:** ${msg.client.guilds.cache.size.toLocaleString()}`,
      `**Users:** ${msg.client.users.cache.size.toLocaleString()}`,
      `**Channels:** ${msg.client.channels.cache.size.toLocaleString()}`,
     ].join('\n'),
     inline: true,
    },
   )
   .setTimestamp();

  if (percentUsed > 70) {
   embed.setDescription('High memory usage detected. Performing detailed analysis...');

   await m.edit({ embeds: [embed] });

   try {
    const analysis = await memAnalyze(`cluster${msg.client.cluster?.id ?? 'unknown'}`);

    const topObjects = analysis.largestObjects.slice(0, 5);

    embed.addFields({
     name: 'Top Memory Consumers',
     value:
      topObjects
       .map(
        (obj, i) => `${i + 1}. \`${obj.name}\` (${obj.type}): ${(obj.size / 1024).toFixed(1)}KB`,
       )
       .join('\n') || 'No large objects found',
    });

    embed.setDescription(`**Total Heap Size:** ${(analysis.totalSize / 1024 / 1024).toFixed(2)}MB`);
   } catch (analyzeError) {
    embed.addFields({
     name: '❌ Deep Analysis Failed',
     value: `Error: ${analyzeError instanceof Error ? analyzeError.message : 'Unknown error'}`,
    });
   }
  }

  await m.edit({ embeds: [embed], content: 'Fin' });
 } catch (error) {
  await m.edit({
   content: `❌ Memory analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
  });
 }
};
