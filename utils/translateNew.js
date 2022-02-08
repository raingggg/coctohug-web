const path = require('path');
const { readdir, writeFile } = require('fs/promises');
const translateOpen = require('google-translate-open-api');
const translate = translateOpen.default;

const translateAll = async (startLocale) => {
  const localePath = path.resolve(__dirname, '../locales');
  let files = await readdir(path.resolve(localePath));
  files = files.filter(f => f.endsWith('.json'));
  console.log('locales', files.map(k => k.replace('.json', '')));

  const en = files.find(f => f === 'en.json');
  const enFile = require(path.resolve(localePath, en));
  let keys = Object.keys(enFile).sort();

  const bak = files.find(f => f === 'en-bak.json');
  const bakFile = require(path.resolve(localePath, bak));
  const newKeys = [];
  keys.forEach(k => {
    if (enFile[k] !== bakFile[k]) {
      newKeys.push(k);
    }
  });
  keys = newKeys.sort();
  console.log('new-keys: ', keys);

  const total = files.length;
  for (let i = 0; i < total; i++) {
    const fileName = files[i];
    const locale = fileName.replace('.json', '');
    if (startLocale && locale < startLocale) continue;
    if (fileName === 'en-bak.json') continue;

    const objContent = require(path.resolve(localePath, fileName));
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
};

const retryTrans = async (val, options) => {
  let res = '';
  let result = '';
  for (let i = 0; i < 20; i++) {
    // console.log('1'.repeat(10));
    if (res && res.data) {
      // console.log(res.data);
      if (res.data.sentences && res.data.sentences.length > 0) {
        result = res.data.sentences;
      } else if (res.data.length > 0) {
        result = res.data;
      }
    }
    // console.log('2'.repeat(10));
    if (result) break;

    try {
      // console.log('3'.repeat(10));
      res = await translate(val, options);
      // console.log('4'.repeat(10), res.data);
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

// translateAll();
translateAll('zh-CN');