import { readdir } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { COMMANDS_LIST, OS_FLAGS, PATH_COMPLETION } from "../constants/constants.js";

export async function completeCommand ( line, currentDirectory ) {
  const spaceIndex = line.indexOf(" ");
  if (spaceIndex === -1) {
    const hits = COMMANDS_LIST.filter(cmd => cmd.startsWith(line))
    return [ hits, line ];
  }

  const command = line.slice(0, spaceIndex);
  const argsInput = line.slice(spaceIndex + 1).trimStart();

  const argsParts = [];
  let currentArg = '';
  let isInsideQuotes = false;

  for ( const char of argsInput ) {
    if (char === '"') {
      isInsideQuotes = !isInsideQuotes;
      currentArg += char;
    } else if (char === ' ' && !isInsideQuotes) {
      if (currentArg !== '') {
        argsParts.push(currentArg);
        currentArg = '';
      }
    } else {
      currentArg += char;
    }
  }

  argsParts.push(currentArg);

  const activeIndex = argsParts.length - 1;

  if (command === 'os') {
    if (activeIndex === 0) {
      const hits = OS_FLAGS.filter(flag => flag.startsWith(argsParts[0]))
      return [hits, argsParts[0]];
    }
    return [[], line];
  }

  const rawPartialPath = argsParts.at(-1);
  const partialPath = rawPartialPath.startsWith('"')
    ? rawPartialPath.slice(1)
    : rawPartialPath;

  const lastSep = partialPath.lastIndexOf(sep);
  const directoryPart = partialPath.slice(0, lastSep + 1);
  const namePrefix = partialPath.slice(lastSep + 1);
  const searchDirectory = resolve(currentDirectory, directoryPart);

  if (command === 'rm' && activeIndex === 1 && argsParts[0] !== '-r') return [[], line]

  const rule = PATH_COMPLETION[command]?.find(item => item.argumentIndex === activeIndex);
  if (!rule) return [ [], line ];

  try {
    const folderContent = await readdir(searchDirectory, { withFileTypes: true });
    const hits = folderContent
      .filter(item => {
        const correctKind =
          (rule.kind === 'directory' && item.isDirectory()) ||
          (rule.kind === 'file' && (item.isDirectory() || item.isFile()));

        return correctKind && item.name.startsWith(namePrefix);
      })
      .map(item => `${directoryPart}${item.name}${item.isDirectory() ? sep : ''}`)

    return [hits, partialPath];
  }
  catch ( error ) {
    return [[], line];
  }
}
