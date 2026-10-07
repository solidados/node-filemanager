import { parseQuotes } from "./parseQuotes.js";

export function parseCommandArgs ( input, prefixLength ) {
  const inputPath = input.slice(prefixLength).trim();
  return parseQuotes(inputPath);
}
