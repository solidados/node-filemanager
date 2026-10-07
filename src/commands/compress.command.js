import { basename, dirname, extname, join, resolve } from "node:path";
import { stat, unlink } from "node:fs/promises";
import { createReadStream, createWriteStream } from "node:fs";
import { createBrotliCompress } from "node:zlib";
import { pipeline } from "node:stream/promises";

export async function handleCompressCommand(argsArr, currentDirectory) {
  if (argsArr !== null && (argsArr.length === 1 || argsArr.length === 2)) {
    const sourceFilePath = resolve(currentDirectory, argsArr[0]);
    let targetFilePath = argsArr[1]
      ? resolve(currentDirectory, argsArr[1])
      : sourceFilePath + '.br';

    let isDestinationCreated = false;

    try {
      if (argsArr[1]) {
        let isTargetDirectory = false;

        try {
          isTargetDirectory = (await stat( targetFilePath )).isDirectory();
        }
        catch (err) {
          if (err.code === 'ENOENT') {
            isTargetDirectory = false;
          } else {
            throw err;
          }
        }

        if (isTargetDirectory) {
          targetFilePath = join(targetFilePath, basename(sourceFilePath) + '.br');
        } else {
          if (extname(argsArr[1]) === '.br') {
            targetFilePath = join(dirname(sourceFilePath), argsArr[1]);
          } else {
            targetFilePath = join(dirname(sourceFilePath), argsArr[1] + '.br');
          }
        }
      }

      const rs = createReadStream(sourceFilePath, { highWaterMark: 1024});
      const compressBrotli = createBrotliCompress();
      const wrs = createWriteStream(targetFilePath, { flags: 'wx' });

      wrs.once('open', () => {
        isDestinationCreated = true;
      })

      await pipeline(rs, compressBrotli, wrs);
      console.log(`-- File: ${basename(targetFilePath)} - compressed successfully --`);
    }
    catch {
      if (isDestinationCreated) {
        try {
          await unlink(targetFilePath);
        }
        catch {
          console.error('Failed to remove partial destination file');
        }
      }
      console.error('Operation failed')
    }
  } else {
    console.error( 'Invalid input' );
  }
}
