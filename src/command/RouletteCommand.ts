import * as Discord from 'discord.js';
import * as _ from 'lodash';
import { channelName } from '../main';
import { BaseCommand } from './BaseCommand';

export class RouletteCommand extends BaseCommand {
  private rouletteEmojis: Discord.Emoji[];

  public onLogin(client: Discord.Client) {
    client.guilds.forEach(guild => {
      if (guild.name !== channelName) {
        return;
      }

      this.log(`${channelName} found`);

      const emojis = guild.emojis;

      this.rouletteEmojis = [...emojis.keys()]
        .filter(id => ['kyouka_what', 'misogi_what', 'mimi_what'].includes(emojis.get(id).name))
        .map(id => emojis.get(id));

      this.log('Success to create roulette!');
    });
  }

  public onMessage(client: Discord.Client, message: Discord.Message) {
    const rollResult = [...Array(3)].map(() => _.sample(this.rouletteEmojis));

    message.channel.send(rollResult.map(emoji => `<:${emoji.name}:${emoji.id}>`).join(''));

    const [first] = rollResult;

    // react to jackpot
    if (rollResult.every(emoji => first === emoji)) {
      message.react(first);
      this.log(`${message.author.username} : ${first.name}`);
    }
  }
}
