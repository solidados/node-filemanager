import { resolve } from "node:path";
import { writeFile } from "node:fs/promises";

export async function handleAddCommand (argsArr, currentDirectory)  {
  if (argsArr !== null && argsArr.length === 1) {
    try {
      const pathToFile = resolve(currentDirectory, argsArr[0]);
      await writeFile(pathToFile, '', { encoding: 'utf8', flag: 'wx' });
    }
    catch (err) {
      if (err?.code === 'EEXIST') {
        console.error('Operation failed. File already exist');
      } else {
        console.error('Operation failed');
      }
    }
  } else {
    console.error('Invalid input');
  }
}
