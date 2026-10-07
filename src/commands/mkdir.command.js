import { resolve } from "node:path";
import { mkdir } from "node:fs/promises";

export async function handleMkdirCommand ( argsArr, currentDirectory ) {
  if (argsArr !== null && argsArr.length === 1) {
    try {
      const pathToFolder = resolve(currentDirectory, argsArr[0]);
      const result = await mkdir(pathToFolder, { recursive: true });
      result || console.error('Folder already exist');
    }
    catch {
      console.error('Operation failed');
    }
  } else {
    console.error( 'Invalid input' )
  }
}
