import type DDeno from 'discordeno';

export default (
  buttonArrays:
    | (DDeno.ButtonComponent | DDeno.SelectMenuComponent)[]
    | (DDeno.ButtonComponent | DDeno.SelectMenuComponent)[][],
): DDeno.ActionRow[] =>
  buttonArrays.map((buttonRow) => {
    const actionRow: DDeno.ActionRow = {
      components: (Array.isArray(buttonRow) ? buttonRow.map((b) => b) : [buttonRow]) as [DDeno.ButtonComponent],
      type: 1,
    };

    return actionRow;
  });
