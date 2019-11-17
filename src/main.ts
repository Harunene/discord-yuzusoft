export const channelName = '유즈소프트';

import * as fs from 'fs';
import { Bot } from './Bot';
import { GachaCommand } from './command/GachaCommand';
import { RouletteCommand } from './command/RouletteCommand';

const nenebot = new Bot([
  new RouletteCommand(['룰렛', 'roulette'], '룰렛을 돌림'),
  new GachaCommand(['가챠', 'gacha'], '10연차를 돌림'),
]);

nenebot.login(process.env.DISCORD_BOT_SECRET);
