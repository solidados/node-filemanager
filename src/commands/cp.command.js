import { basename, resolve } from "node:path";
import { stat, unlink } from "node:fs/promises";
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";

export async function handleCpCommand ( argsArr, currentDirectory ) {
  try {
    if (argsArr !== null && argsArr.length === 2) {
      const sourcePath = resolve(currentDirectory, argsArr[0]);
      const targetPath = resolve(currentDirectory, argsArr[1]);

      const isDir = (await stat(targetPath)).isDirectory();
      const isFile = (await stat(sourcePath)).isFile();

      if (isDir && isFile) {
        const destinationPath = resolve(targetPath, basename(sourcePath));
        const readStream = createReadStream(sourcePath);
        const writeStream = createWriteStream(destinationPath, { flags: 'wx' });

        let isDestinationCreated = false;

        writeStream.on('open', () => {
          isDestinationCreated = true;
        })

        try {
          await pipeline(readStream, writeStream);
          console.log('-- File copied successfully --');
        } catch (err) {
          if (isDestinationCreated) {
            await unlink(destinationPath);
          }
          throw err;
        }
      } else {
        console.error('Operation failed');
      }
    } else {
      console.error('Invalid input');
    }
  } catch (err) {
    if (err?.code === 'EEXIST') {
      console.error('Operation failed. File already exist');
    } else {
      console.error('Operation failed');
    }
  }
}
