import * as Discord from 'discord.js';
import { BaseCommand } from './command/BaseCommand';
import * as _ from 'lodash';

export class Bot {
  private commandMap: Map<string, BaseCommand>;
  private commands: BaseCommand[];
  constructor(commands: BaseCommand[]) {
    this.commands = commands;
    this.commandMap = new Map<string, BaseCommand>();
    commands.forEach(cmd => {
      cmd.keywords.forEach(keyword => this.commandMap.set(keyword, cmd));
    });
  }
  public login(secret: string) {
    const client = new Discord.Client();

    client.login(secret);
    client.on('ready', () => this.onReady(client));
    client.on('error', (err: Error) => this.onError(err));
    client.on('message', (message: Discord.Message) => {
      if (message.author.bot) {
        return;
      }

      if (message.content.indexOf('!') !== 0) {
        return;
      }

      const args = message.content
        .slice(1)
        .trim()
        .split(/ +/g);

      const command = args.shift().toLowerCase();

      if (this.commandMap.has(command)) {
        this.commandMap.get(command).onMessage(client, message, args);
      } else {
        message.channel.send(
          _.sample([
            '하?',
            '하???????',
            '뭐래는거야...',
            'は？',
            'は？？？？？？',
            '何言ってんの？？',
            'そんなの知らないけど？？？',
          ]),
        );
      }
    });
  }

  public log(msg: string) {
    // tslint:disable-next-line: no-console
    console.log(`[Bot] ${msg}`);
  }

  private onReady(client: Discord.Client) {
    this.log(`Connected as ${client.user.tag}`);
    this.commands.forEach(cmd => cmd.onLogin(client));
  }

  private onError(err: Error) {
    this.log(`Error! ${err.name} ${err.message}`);
  }
}
