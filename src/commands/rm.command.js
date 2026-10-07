import { isAbsolute, parse, relative, resolve, sep } from "node:path";
import { homedir } from "node:os";
import { rm, unlink } from "node:fs/promises";

export async function handleRmCommand ( argsArr, currentDirectory ) {
  if (argsArr !== null && (argsArr.length === 1 && !argsArr[0].startsWith('-'))) {
    try {
      const targetPath = resolve( currentDirectory, argsArr[0] );
      await unlink( targetPath );
      console.log('-- File deleted successfully --');
    }
    catch ( err ) {
      console.error( 'Operation failed' );
    }
  } else if (argsArr !== null && (argsArr.length === 2 && argsArr[0] === '-r' && !argsArr[1].startsWith('-'))) {
    try {
      const targetPath = resolve(currentDirectory, argsArr[1]);
      const relativePath = relative(targetPath, currentDirectory);
      const isCurrentOrAncestor = (path) => {
        const firstSegment = path.split(sep)[0];
        return path === '' || (!isAbsolute(path) && firstSegment !== '..');
      }
      const isHomeDirectory = targetPath === homedir();
      const isFilesystemRoot = targetPath === parse(targetPath).root;
      const isProtectedTarget = isCurrentOrAncestor(relativePath) || isHomeDirectory || isFilesystemRoot;

      if (isProtectedTarget) {
        throw new Error('The path is protected');
      } else {
        await rm(targetPath, { recursive: true, force: false });
      }
    }
    catch {
      console.error('Operation failed');
    }
  } else {
    console.error('Invalid input')
  }
}
