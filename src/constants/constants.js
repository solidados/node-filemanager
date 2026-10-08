export const PREFIX = '> ';
export const TYPE_PRIORITY = {
  folder: 1,
  file: 2,
  link: 3,
  other: 4,
}
export const COMMANDS_LIST = ['ls', 'cd', 'up', '..', 'cat', 'add', 'mkdir', 'rn', 'cp', 'mv', 'rm', 'os', 'hash', 'compress', 'decompress', '.exit']

export const OS_FLAGS = ['--EOL', '--cpus', '--homedir', '--username', '--architecture'];

export const PATH_COMPLETION = {
  add: [{ argumentIndex: 0, kind: 'directory' }],
  mkdir: [{ argumentIndex: 0, kind: 'directory' }],
  cd: [{ argumentIndex: 0, kind: 'directory' }],
  cat: [{ argumentIndex: 0, kind: 'file' }],
  hash: [{ argumentIndex: 0, kind: 'file' }],
  ls: [{ argumentIndex: 0, kind: 'directory' }],
  cp: [
    { argumentIndex: 0, kind: 'file' },
    { argumentIndex: 1, kind: 'directory' },
  ],
  mv: [
    { argumentIndex: 0, kind: 'file' },
    { argumentIndex: 1, kind: 'directory' },
  ],
  rn: [{ argumentIndex: 0, kind: 'file' }],
  rm: [
    { argumentIndex: 0, kind: 'file' },
    { argumentIndex: 1, kind: 'file' },

  ],
  compress: [
    { argumentIndex: 0, kind: 'file' },
    { argumentIndex: 1, kind: 'directory' },
  ],
  decompress: [
    { argumentIndex: 0, kind: 'file' },
    { argumentIndex: 1, kind: 'directory' },
  ],
}
