/* eslint-disable no-useless-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as Discord from 'discord.js';
// @ts-ignore
import fetch from 'node-fetch';
import auth from '../../../auth.json' assert { type: 'json' };
// @ts-ignore
import * as ch from '../../../BaseClient/ClientHelper.js';

export default async (msg: Discord.Message) => {
 if (msg.author.id !== auth.ownerID) return;
 if (!msg.content.startsWith('exe')) return;

 const embed: Discord.APIEmbed = {
  title: 'All commands',
  description: '</ovo start:1106556728721559652> - Get your first pet to start playing.',
  fields: [
   {
    name: 'Earn 💎 crystals',
    value: `
    </ovo team:1106556728721559652> - Setup your pet team.
    </ovo play:1106556728721559652> - Play with your pets +10 💎 multiplied by your pet team size in 5min.
    </ovo groom:1106556728721559652> - Groom your pets +7 💎 multiplied by your pet team size in 2min.
    </ovo feed:1106556728721559652> - Feed your pets +5 💎 multiplied by your pet team size in 1min.
    </ovo release:1106556728721559652> - Release your pet to get crystals.
    `,
   },
   {
    name: 'Get more pets',
    value: `
    </ovo roll:1106556728721559652> - Hatch an egg to get 🔶 Common pet.
    </ovo rroll:1106556728721559652> - Catch a creature to get 💠 Rare or 🔶 Common pet.
    </ovo sroll:1106556728721559652> - Hatch a special egg to get 🔷 Special, 💠 Rare or 🔶 Common pet.
    </ovo groll:1106556728721559652> - Hatch a special global egg to get 🔷 Special (all server), 💠 Rare or 🔶 Common pet.
    `,
   },
   {
    name: 'Trade with other players',
    value: `
    </ovo trade:1106556728721559652> - Propose a trade for another player. Once they accept, you will be able to lock in pets or crystals and do the exchange.
    `,
   },
   {
    name: 'Upgrades',
    value: `
    </ovo upgrade:1106556728721559652> - Exchange 2 pets of the same tier to evolve a pet of your choice into a higher tier. Having higher tier pets in your team results in upgraded visuals of your </ovo profile:1106556728721559652>.
    `,
   },
   {
    name: 'Other commands',
    value: `
    </ovo profile:1106556728721559652> - See your own or other user profile.
    </ovo pets:1106556728721559652> - See your or other user's pets.
    </ovo view:1106556728721559652> - Inspect specific pet.
    </ovo leaderboard:1106556728721559652> - View leaderboard.
    </ovo specials:1106556728721559652> - View participating servers where you can obtain special pets.
    `,
   },
  ],
  color: 0xff9ae2,
 };

 const webhook = await msg.client.fetchWebhook(
  '1110211059178012802',
  'yJodjSaCEkRVwKCVOVDfV7BXpKo0VpYWVmWJRRmHyf5PZnOwZZonLsPGCr5JwYD9Ri_Y',
 );
 webhook.send({ embeds: [embed] });
};
