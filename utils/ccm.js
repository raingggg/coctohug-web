const path = require('path');
const { promisify } = require('util');
const { readdir, copyFile, readFile, writeFile } = require('fs/promises');
const exec = promisify(require('child_process').exec);

const ccmRepoPath = path.resolve(__dirname, '../../coctohug');
const ccmImagesPath = path.resolve(ccmRepoPath, './images');
const ccmMdPath = path.resolve(ccmRepoPath, './docs/ccm');

const destImagesPath = path.resolve(__dirname, '../public/images');
const destMdPath = path.resolve(__dirname, '../public/docs/ccm');

const processCcm = async () => {
  const imageFiles = await readdir(path.resolve(ccmImagesPath));
  for (let i = 0; i < imageFiles.length; i++) {
    const fileName = imageFiles[i];
    await copyFile(path.resolve(ccmImagesPath, fileName), path.resolve(destImagesPath, fileName));
  }

  const mdFiles = await readdir(path.resolve(ccmMdPath));
  for (let i = 0; i < mdFiles.length; i++) {
    const fileName = mdFiles[i];
    const filePureName = fileName.replace('.md', '');
    const mdFile = path.resolve(ccmMdPath, fileName);
    const destFile = path.resolve(destMdPath, `${filePureName}.html`);

    try {
      await exec(`marked -i ${mdFile} -o ${destFile}`);
      const content = await readFile(destFile, 'utf8');
      await writeFile(destFile, content.replaceAll('.md', '.html'));
    } catch (e) {
      console.error(e);
    }
  }

};

processCcm();