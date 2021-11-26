const path = require('path');
const { promisify } = require('util');
const { readdir, readFile, writeFile } = require('fs/promises');
const translate = require('@vitalets/google-translate-api');
const trans = promisify(translate);

const translateAll = async () => {
  const localePath = path.resolve(__dirname, '../locales');
  let files = await readdir(path.resolve(localePath));
  files = files.filter(f => f.endsWith('.json'));
  console.log('locales', files.map(k => k.replace('.json', '')));

  const en = files.find(f => f === 'en.json');
  const enFile = require(path.resolve(localePath, en));
  const keys = Object.keys(enFile).sort();

  for (let i = 0; i < files.length; i++) {
    const objContent = {};
    const fileName = files[i];
    const locale = fileName.replace('.json', '');
    console.log('\nlocale', locale);
    for (let j = 0; j < keys.length; j++) {
      const key = keys[j];
      const val = enFile[key];
      if (fileName === en) {
        objContent[key] = val;
      } else {
        const res = await translate(val, { from: 'en', to: locale });
        objContent[key] = res.text;
        console.log(key, [val, res.text]);
      }
    }

    await writeFile(path.resolve(localePath, fileName), JSON.stringify(objContent, null, 2));
  }
};

translateAll();