const path = require('path');
const { readdir, writeFile, copyFile } = require('fs/promises');
const translateOpen = require('google-translate-open-api');
const translate = translateOpen.default;

const translateAll = async (startLocale) => {
  const localePath = path.resolve(__dirname, '../locales');
  let files = await readdir(path.resolve(localePath));
  files = files.filter(f => f.endsWith('.json'));
  console.log('locales', files.map(k => k.replace('.json', '')));

  const en = files.find(f => f === 'en.json');
  const enFile = require(path.resolve(localePath, en));
  const keys = Object.keys(enFile).sort();

  const total = files.length;
  for (let i = 0; i < total; i++) {
    const objContent = {};
    const fileName = files[i];
    const locale = fileName.replace('.json', '');
    if (startLocale && locale < startLocale) continue;
    if (fileName === 'en-bak.json') continue;

    console.log('\nlocale ', `${locale} - ${i} of ${total}`);
    for (let j = 0; j < keys.length; j++) {
      if (j % 20 === 0) console.log('processing ', j);

      const key = keys[j];
      const val = enFile[key];
      if (fileName === en) {
        objContent[key] = val;
      } else {
        console.log('translating:', val);
        const res = await retryTrans(val, { client: "dict-chrome-ex", from: 'en', to: locale });
        objContent[key] = res;
      }
    }

    await writeFile(path.resolve(localePath, fileName), JSON.stringify(objContent, null, 2));
  }

  await copyFile(path.resolve(localePath, 'en.json'), path.resolve(localePath, 'en-bak.json'));
};


const retryTrans = async (val, options) => {
  let res = '';
  let result = '';
  for (let i = 0; i < 20; i++) {
    if (res && res.data) {
      if (res.data.sentences && res.data.sentences.length > 0) {
        result = res.data.sentences;
      } else if (res.data.length > 0) {
        result = res.data;
      }
    }
    if (result) break;

    try {
      res = await translate(val, options);
    } catch (e) {
      console.log('retrying...');
    }
  }

  console.log('result', result);
  return result.map(s => {
    if (typeof s === 'object') {
      if (s.trans) return s.trans;
      return '';
    }

    return s;
  }).join('');
};


translateAll('zh-CN');
// translateAll('ko');