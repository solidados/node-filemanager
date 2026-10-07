import { rename } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { isPathOccupied } from "../utils/index.js";

export async function handleRnCommand ( argsArr, currentDirectory ) {
  if (argsArr !== null && argsArr.length === 2) {
    const sourcePath = resolve(currentDirectory, argsArr[0]);
    const sourceDirectory = dirname(sourcePath);
    const targetFileName = basename(argsArr[1]);

    if (argsArr[1] === targetFileName && (targetFileName !== '.' && targetFileName !== '..')) {
      const targetPath = resolve(sourceDirectory, argsArr[1]);
      try {
        const isNameOccupied = await isPathOccupied(targetPath)

        if (isNameOccupied) {
          console.error('This filename is occupied');
        } else {
          await rename(sourcePath, targetPath);
        }
      }
      catch {
        console.error('Operation failed')
      }
    } else {
      console.error('Invalid input');
    }
  } else {
    console.error('Invalid input');
  }
}
