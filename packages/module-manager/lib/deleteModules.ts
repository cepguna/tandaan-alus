import { checkbox } from '@inquirer/prompts';
import fs, { createReadStream, createWriteStream } from 'node:fs';
import { rimraf } from 'rimraf';
import { posix, resolve } from 'node:path';
import { AsyncZipDeflate, Zip } from 'fflate';
import fg from 'fast-glob';

const pagesPath = resolve(import.meta.dirname, '..', '..', '..', 'pages');
const archivePath = resolve(import.meta.dirname, '..', 'archive');

const pageFolders = fs.readdirSync(pagesPath);

const DEFAULT_CHOICES = [
  { name: 'Background Script', value: 'background' },
  { name: 'Content Script (Execute JS on Web Page)', value: 'content' },
  { name: 'Popup (On Extension Icon Click)', value: 'popup' },
];

export default async function deleteModules(manifestObject: chrome.runtime.ManifestV3) {
  const choices = DEFAULT_CHOICES.filter(choice => {
    if (choice.value === 'background') {
      return !!manifestObject.background;
    }
    return pageFolders.includes(choice.value);
  });

  if (!choices.length) {
    console.log('No features to delete');
    process.exit(0);
  }

  const answers = await checkbox({
    message: 'Choose the features you want to delete',
    loop: false,
    choices,
  });

  if (answers.length === 0) {
    console.log('No features selected');
    process.exit(0);
  }
  if (!fs.existsSync(archivePath)) {
    fs.mkdirSync(archivePath, { recursive: true });
  }
  if (answers.includes('background')) {
    deleteBackgroundScript(manifestObject);
  }
  if (answers.includes('content')) {
    await deleteContentScript(manifestObject);
  }
  if (answers.includes('popup')) {
    await deletePopup(manifestObject);
  }
  console.log(`Deleted selected features: ${answers.join(', ')}`);
}

function deleteBackgroundScript(manifestObject: chrome.runtime.ManifestV3) {
  if (manifestObject.background) {
    delete manifestObject.background;
  }
}

async function deleteContentScript(manifestObject: chrome.runtime.ManifestV3) {
  await zipFolder(resolve(pagesPath, 'content'), resolve(archivePath, 'content.zip'));
  void rimraf(resolve(pagesPath, 'content'));
  const jsName = 'content/index.iife.js';
  manifestObject.content_scripts = manifestObject.content_scripts?.filter(script => {
    return !script.js?.includes(jsName);
  });
}

async function deletePopup(manifestObject: chrome.runtime.ManifestV3) {
  await zipFolder(resolve(pagesPath, 'popup'), resolve(archivePath, 'popup.zip'));
  void rimraf(resolve(pagesPath, 'popup'));
  if (manifestObject.action) {
    delete manifestObject.action.default_popup;
  }
}

async function zipFolder(path: string, out: string) {
  const fileList = await fg(['**/*', '!node_modules', '!dist'], {
    cwd: path,
    onlyFiles: true,
  });
  const output = createWriteStream(out);
  return new Promise<void>((promiseResolve, promiseReject) => {
    let aborted = false;

    const zip = new Zip((err, data, final) => {
      if (err) {
        promiseReject(err);
      } else {
        output.write(data);
        if (final) {
          output.end();
          promiseResolve();
          console.log(`Archive created at: ${out} for recovery`);
        }
      }
    });

    for (const file of fileList) {
      if (aborted) return;

      const absPath = resolve(path, file);
      const absPosixPath = posix.resolve(path, file);
      const relPosixPath = posix.relative(path, absPosixPath);

      console.log(`Achieving file: ${relPosixPath}`);
      streamFileToZip(
        absPath,
        relPosixPath,
        zip,
        () => {
          aborted = true;
          output.end();
          promiseReject(new Error('Aborted'));
        },
        error => {
          aborted = true;
          output.end();
          promiseReject(error);
        },
      );
    }

    zip.end();
  });
}

function streamFileToZip(
  absPath: string,
  relPath: string,
  zip: Zip,
  onAbort: () => void,
  onError: (error: Error) => void,
): void {
  const data = new AsyncZipDeflate(relPath, { level: 1 });
  void zip.add(data);

  createReadStream(absPath)
    .on('data', (chunk: string | Buffer) =>
      typeof chunk === 'string' ? data.push(Buffer.from(chunk), false) : data.push(chunk, false),
    )
    .on('end', () => data.push(new Uint8Array(0), true))
    .on('error', error => {
      onAbort();
      onError(error);
    });
}
