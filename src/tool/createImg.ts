import * as low from 'lowdb';
import FileSync = require('lowdb/adapters/FileSync');
import * as Canvas from 'canvas';
import * as fs from 'fs';

var chardb = low(new FileSync('data/characters.json'))
  .get('characters')
  .value();

var starImg;
Canvas.loadImage('resource/star.png').then(img => {
  starImg = img;
  Promise.all(
    chardb.map(async obj => [
      obj.name,
      await Canvas.loadImage(`./resource/icons_original/${obj.name}.png`),
    ]),
  ).then(obj => {
    obj.forEach(([key, value]) => {
      const char = chardb.find(char => char.name == key);
      const canvas = Canvas.createCanvas(128, 128);
      const ctx = canvas.getContext('2d');
      const img = value;
      ctx.drawImage(img, 0, 0);
      [...Array(~~char.rare)].forEach((_, i) => {
        ctx.drawImage(starImg, 128 - starImg.width * (i + 1) - 3, 128 - starImg.height - 3);
      });
      fs.writeFileSync('resource/icons/' + char.name + '.png', canvas.toBuffer());
    });
  });
});
