import path from 'node:path';
import fs from 'node:fs';
import { unzipSync } from 'fflate';
import { checkbox } from '@inquirer/prompts';

const pagesPath = path.resolve(import.meta.dirname, '..', '..', '..', 'pages');
const archivePath = path.resolve(import.meta.dirname, '..', 'archive');

const archiveFiles = fs.existsSync(archivePath) ? fs.readdirSync(archivePath) : [];

const DEFAULT_CHOICES = [
  { name: 'Background Script', value: 'background' },
  { name: 'Content Script (Execute JS on Web Page)', value: 'content' },
  { name: 'Popup (On Extension Icon Click)', value: 'popup' },
];

export default async function recoverModules(manifestObject: chrome.runtime.ManifestV3) {
  const choices = DEFAULT_CHOICES.filter(choice => {
    if (choice.value === 'background') {
      return !manifestObject.background;
    }
    return archiveFiles.includes(`${choice.value}.zip`);
  });

  if (!choices.length) {
    console.log('No features to recover');
    process.exit(0);
  }

  const answers = await checkbox({
    message: 'Choose the features you want to recover',
    loop: false,
    choices,
  });

  if (answers.length === 0) {
    console.log('No features selected');
    process.exit(0);
  }
  if (answers.includes('background')) {
    recoverBackgroundScript(manifestObject);
  }
  if (answers.includes('content')) {
    recoverContentScript(manifestObject);
  }
  if (answers.includes('popup')) {
    recoverPopup(manifestObject);
  }
  console.log(`Recovered selected features: ${answers.join(', ')}`);
}

function recoverBackgroundScript(manifestObject: chrome.runtime.ManifestV3) {
  manifestObject.background = {
    service_worker: 'background.js',
    type: 'module',
  };
}

function recoverContentScript(manifestObject: chrome.runtime.ManifestV3) {
  if (!manifestObject.content_scripts) {
    manifestObject.content_scripts = [];
  }
  manifestObject.content_scripts.push({
    matches: ['http://*/*', 'https://*/*', '<all_urls>'],
    js: ['content/index.iife.js'],
  });
  const zipFilePath = path.resolve(archivePath, 'content.zip');
  upZipAndDelete(zipFilePath, path.resolve(pagesPath, 'content'));
}

function recoverPopup(manifestObject: chrome.runtime.ManifestV3) {
  manifestObject.action = {
    default_popup: 'popup/index.html',
    default_icon: 'icon-34.png',
  };
  const zipFilePath = path.resolve(archivePath, 'popup.zip');
  upZipAndDelete(zipFilePath, path.resolve(pagesPath, 'popup'));
}

function upZipAndDelete(zipFilePath: string, destPath: string) {
  const unzipped = unzipSync(fs.readFileSync(zipFilePath));
  fs.mkdirSync(destPath, { recursive: true });
  for (const [filename, fileData] of Object.entries(unzipped)) {
    const filePath = path.join(destPath, filename);
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, fileData);
  }
  fs.unlinkSync(zipFilePath);
}
