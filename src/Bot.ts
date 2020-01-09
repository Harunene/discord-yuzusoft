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
            '미쳤냐?',
            '뒤진다...',
            '뒤질래?',
            '진짜 뒤진다',
            'わかる～',
            'ウケるww',
            'マジ引く～',
            'ウケるけど…',
            'はいはい',
            'それやめて',
            'うわ、きも…',
            'キモいじゃん…',
            'ウケる～',
            '아ㅋㅋ',
            'ㅋㅋ',
            'ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ',
            'ㅡㅡ',
            '야...',
            '아 좀',
            '바보냐...',
            '기분나쁜데요...',
            '기분나빠',
            'バカかよ…',
            'ㄴㄴ',
            '싫은데요...',
            'ㅎㅎ;',
            '귀찮은데...',
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
