export function parseQuotes (argsInput) {
  let isInsideQuotes = false;
  let currentArg = '';
  const argsArr = [];

  for (const char of argsInput) {
    if (char === '"') {
      isInsideQuotes = !isInsideQuotes;
      continue;
    }
    if (char === ' ' && !isInsideQuotes) {
      if (currentArg !== '') argsArr.push(currentArg);
      currentArg = '';
    } else {
      currentArg += char;
    }
  }

  if (currentArg !== '') argsArr.push(currentArg);

  return isInsideQuotes ? null : argsArr;
}
