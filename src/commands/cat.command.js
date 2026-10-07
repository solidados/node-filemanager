import { resolve } from "node:path";
import { createReadStream } from "node:fs";
import { stdout } from "node:process";
import { once } from 'node:events';

export async function handleCatCommand (argsArr, currentDirectory) {
  if (argsArr !== null && argsArr.length === 1) {
    try {
      const pathToFile = resolve(currentDirectory, argsArr[0]);
      const rs = createReadStream(pathToFile);

      for await (const chunk of rs) {
        const chunkResult = stdout.write(chunk);
        if (!chunkResult) {
          await once(stdout,'drain')
        }
      }
    }
    catch (err) {
      if (err?.code === 'ENOENT') {
        console.error('Operation failed. File does not exist');
      } else {
        console.error('Operation failed');
      }
    }
  } else {
    console.error('Invalid input');
  }
}
