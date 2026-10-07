import { readdir, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { resolve } from "node:path";
import { TYPE_PRIORITY } from "../constants/constants.js";
import { formatSize } from "../utils/index.js";

export async function handleLsCommand (argsArr, currentDirectory) {
  if (argsArr === null || argsArr.length > 1) {
    console.error('Invalid input');
    return currentDirectory;
  }

  const targetPath = argsArr.length === 0
    ? currentDirectory
    : resolve(currentDirectory, argsArr[0]);

  try {
    const targetStat = await stat(targetPath);

    if (!targetStat.isDirectory()) {
      console.error(
        targetStat.isFile()
          ? 'Path is a file'
          : 'Path is not a directory'
      )
      return currentDirectory;
    }
    const content = await readdir(targetPath, { withFileTypes: true });

    const result = await Promise.all(
      content.map(async (item) => {
        const type = item.isDirectory()
          ? 'folder'
          : item.isFile()
            ? 'file'
            : item.isSymbolicLink()
              ? 'link'
              : 'other'

        let sizeFormatted = '-';

        if (item.isFile()) {
          const itemPath = resolve( targetPath, item.name );
          const itemStats = await stat( itemPath );
          sizeFormatted = formatSize( itemStats.size );
        }

        return {
          name: item.name,
          size: sizeFormatted,
          type
        };
      })
    )

    result.sort((a, b) => {
      const typeDiff = TYPE_PRIORITY[a.type] - TYPE_PRIORITY[b.type];

      if (typeDiff !== 0) return typeDiff;
      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
    })

    console.table(result);
    return currentDirectory;
  } catch (error) {
    console.error('Operation failed')
    if ((error.code === 'ENOENT' || error.code === 'ENOTDIR') && argsArr.length === 0) {
      return homedir();
    }
    return currentDirectory;
  }
}
