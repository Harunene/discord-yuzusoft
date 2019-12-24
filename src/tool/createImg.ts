import * as Canvas from 'canvas';
import * as fs from 'fs';
import * as util from 'util';
import fetch from 'node-fetch';

interface Record {
  name: string;
  rare: number;
  gacha: boolean;
}
interface ImageRecord extends Record {
  image: any;
}

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

(async () => {
  let res = await fetch(
    'https://raw.githubusercontent.com/Expugn/priconne-quest-helper/master/data/character_data.json',
  );
  let newJson = await res.json();

  var chardb = low(new FileSync('resource/characters.json')).get('characters');

  var charNameSet = new Set(chardb.value().map(obj => obj.name));

  var newNames = Object.values(newJson)
    .map((record: { thematic: string; name: string }) => {
      const prefix = record.thematic.replace(' ', '_');
      if (prefix) return `${prefix}_${record.name}`;
      return record.name;
    })
    .filter(name => !charNameSet.has(name));

  if (newNames.length == 0) console.log('No added character...');
  else {
    newNames
      .reduce((chardb, name) => (chardb = chardb.push({ name, rare: 3, gacha: true })), chardb)
      .write();

    await Promise.all(
      newNames.map(async name => {
        const writeFile = util.promisify(fs.writeFile);
        const img = await fetch(
          `https://raw.githubusercontent.com/Expugn/priconne-quest-helper/master/images/unit_icon/${name}.png`,
        );
        const buf = await img.arrayBuffer();
        await writeFile(`resource/icons_original/${name}.png`, Buffer.from(buf));
        console.log('new image downloaded : ' + name);
      }),
    );
  }

  var starImg = await Canvas.loadImage('resource/star.png');
  (
    await Promise.all(
      chardb.value().map(async (record: Record) => ({
        ...record,
        image: await Canvas.loadImage(`./resource/icons_original/${record.name}.png`),
      })),
    )
  ).forEach((record: ImageRecord) => {
    const canvas = Canvas.createCanvas(128, 128);
    const ctx = canvas.getContext('2d');
    const img = record.image;
    ctx.drawImage(img, 0, 0);
    [...Array(~~record.rare)].forEach((_, i) => {
      ctx.drawImage(starImg, 128 - starImg.width * (i + 1) - 3, 128 - starImg.height - 3);
    });
    fs.writeFileSync('resource/icons/' + record.name + '.png', canvas.toBuffer());
  });
})();
