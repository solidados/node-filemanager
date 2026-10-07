import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import { pipeline } from "node:stream/promises";

export async function handleHashCommand( argsArr, currentDirectory) {
  if (argsArr !== null && argsArr.length === 1) {
    try {
      const pathToFileToHash = resolve(currentDirectory, argsArr[0]);

      const hash = createHash('sha256');
      const rs = createReadStream(pathToFileToHash);

      await pipeline(rs, hash);
      console.log(hash.digest('hex'));
    }
    catch {
      console.error('Operation failed')
    }
  } else {
    console.error('Invalid input')
  }
}
