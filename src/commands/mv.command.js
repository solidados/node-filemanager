import { basename, resolve } from "node:path";
import { createReadStream, createWriteStream } from "node:fs";
import { stat, unlink } from "node:fs/promises";
import { pipeline } from "node:stream/promises";

export async function handleMvCommand (argsArr, currentDirectory) {
  try {
    if (argsArr !== null && argsArr.length === 2) {
      const sourcePath = resolve(currentDirectory, argsArr[0]);
      const targetPath = resolve(currentDirectory, argsArr[1]);

      const isDir = (await stat( targetPath )).isDirectory();
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
        } catch (err) {
          if (isDestinationCreated) {
            await unlink(destinationPath);
          }
          throw err;
        }
        await unlink(sourcePath);
        console.log('-- File moved successfully --');
      } else {
        console.log('Operation failed');
      }
    } else {
      console.log('Invalid input');
    }
  }
  catch {
    console.error('Operation failed')
  }
}
