import { argv } from "node:process";

export const parseArgs = () => {
  const userNameArg = argv[2];
  const prefix = '--username=';

  if (userNameArg && userNameArg.startsWith(prefix)) {
    const name = userNameArg.slice(prefix.length);

    if (name.length > 0) {
      return name;
    }
  }
  return undefined;
}
