import * as Discord from 'discord.js';

export default (
 components: Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[],
): Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[] =>
 components.map((c) => ({
  type: Discord.ComponentType.ActionRow,
  components: c.components.map((button) => ({
   ...button,
   disabled: !(
    button.type === Discord.ComponentType.Button && button.style === Discord.ButtonStyle.Link
   ),
  })),
 }));
