export const PREFIX = '> ';
export const TYPE_PRIORITY = {
  folder: 1,
  file: 2,
  link: 3,
  other: 4,
}
export const COMMANDS_LIST = ['ls', 'cd', 'up', '..', 'cat', 'add', 'mkdir', 'rn', 'cp', 'mv', 'rm', 'os', 'hash', 'compress', 'decompress', '.exit']

export const PATH_COMPLETION = {
  cd: [{ argumentIndex: 0, kind: 'directory' }],
  cat: [{ argumentIndex: 0, kind: 'file' }],
  hash: [{ argumentIndex: 0, kind: 'file' }],
  ls: [{ argumentIndex: 0, kind: 'directory' }],
  cp: [
    { argumentIndex: 0, kind: 'file' },
    { argumentIndex: 1, kind: 'directory' },
  ]
}
