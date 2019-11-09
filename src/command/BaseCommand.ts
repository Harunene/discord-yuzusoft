import * as Discord from 'discord.js'

export abstract class BaseCommand {
  [indexSignature: string]: any
  public keywords: string[]
  public description: string

  constructor(keywords: string[], description: string) {
    this.keywords = keywords
    this.description = description
  }

  public abstract onLogin(client: Discord.Client): void

  public abstract onMessage(client: Discord.Client, message: Discord.Message, args: string[]): void

  public log(msg: string) {
    // tslint:disable-next-line: no-console
    console.log(`[${this.__proto__.constructor.name}] ${msg}`)
  }
}
