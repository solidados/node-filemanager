import { basename, resolve } from "node:path";
import { createReadStream, createWriteStream } from "node:fs";
import { createBrotliDecompress } from "node:zlib";
import { pipeline } from "node:stream/promises";
import { unlink } from "node:fs/promises";

export async function handleDecompressCommand(argsArr, currentDirectory) {
  if (argsArr !== null && argsArr.length === 2) {
    const sourceFilePath = resolve(currentDirectory, argsArr[0]);
    const targetFilePath = resolve(currentDirectory, argsArr[1]);

    let isDestinationCreated = false;

    try {
      const rs = createReadStream(sourceFilePath, { highWaterMark: 1024});
      const decompressBrotli = createBrotliDecompress();
      const wrs = createWriteStream(targetFilePath, { flags: 'wx' });

      wrs.once('open', () => {
        isDestinationCreated = true;
      })

      await pipeline(rs, decompressBrotli, wrs);

      console.log(`-- File: ${basename(targetFilePath)} - decompressed successfully --`);
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
    console.error('Invalid input');
  }
}
