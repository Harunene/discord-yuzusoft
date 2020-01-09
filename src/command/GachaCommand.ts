import * as Canvas from 'canvas';
import * as Discord from 'discord.js';
import * as _ from 'lodash';
import * as low from 'lowdb';
import FileSync = require('lowdb/adapters/FileSync');
import { BaseCommand } from './BaseCommand';

export class GachaCommand extends BaseCommand {
  private iconNames: string[];
  private iconImages: Map<string, Canvas.Image>;
  private characters: any[]; // TODO: Add Character class

  public async onLogin(client: Discord.Client) {
    this.characters = low(new FileSync('resource/characters.json'))
      .get('characters')
      .value();

    this.iconImages = new Map(
      await Promise.all(
        this.characters.map(async char => {
          return <[string, Canvas.Image]>[
            char.name,
            await Canvas.loadImage(`./resource/icons/${char.name}.png`),
          ];
        }),
      ),
    );

    this.log(`Read ${this.characters.length} image loaded.`);
  }

  public onMessage(client: Discord.Client, message: Discord.Message) {
    if (this.iconImages === undefined) {
      return;
    }

    var logmsg = '';

    const gachaImage = (index: number) => {
      const gachaSeed = index != 9 ? _.random(999) : _.random(795, 999);
      let gachaStar = _.findIndex([0, 795, 975, 1000], p => {
        return gachaSeed < p;
      });

      if (message.author.username == '하루네네') gachaStar = 3;

      const gachaPool = this.characters.filter(char => char.rare === gachaStar);
      const gachaName = _.sample(gachaPool).name;

      if (gachaStar == 3) {
        if (logmsg) logmsg += ', ';
        logmsg += [gachaSeed, gachaName];
      }
      return this.iconImages.get(gachaName);
    };

    const canvas = Canvas.createCanvas(128 * 5, 128 * 2);
    const ctx = canvas.getContext('2d');
    const f = (__, index) => {
      ctx.drawImage(gachaImage(index * 2), 128 * index, 0);
      ctx.drawImage(gachaImage(index * 2 + 1), 128 * index, 128);
    };
    [...Array(5)].forEach(f);

    const attachment = new Discord.Attachment(canvas.toBuffer());
    message.channel.send('', attachment);

    if (logmsg) this.log(`${message.author.username} : ${logmsg}`);
  }
}
