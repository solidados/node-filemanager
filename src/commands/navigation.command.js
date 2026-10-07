import { dirname, resolve } from "node:path";
import { stat } from "node:fs/promises";

export async function handleCdCommand ( argsArr, currentDirectory ) {
  if (argsArr !== null && argsArr.length === 1) {
    try {
      const targetPath = resolve( currentDirectory, argsArr[ 0 ] );
      const status = await stat( targetPath );
      const isDir = status.isDirectory();

      if (isDir) {
        return targetPath;
      }

      console.error('Operation failed');
      return currentDirectory;
    }
    catch {
      console.error('Operation failed');
      return currentDirectory;
    }
  } else {
    console.error('Invalid input')
    return currentDirectory;
  }
}

export function handleUpCommand ( currentDirectory ) {
  return dirname( currentDirectory );
}
