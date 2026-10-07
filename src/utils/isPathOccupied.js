import { lstat } from "node:fs/promises";

export async function isPathOccupied(path) {
  try {
    await lstat(path);
    return true;
  } catch (err) {
    if (err?.code === 'ENOENT') {
      return false;
    } else {
      throw err;
    }
  }
}
