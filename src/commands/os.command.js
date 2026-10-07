import { arch, cpus, EOL, homedir, userInfo } from "node:os";

export function handleOsCommand(argsArr) {
  const flags = ['--EOL', '--cpus', '--homedir', '--username', '--architecture'];

  if (argsArr !== null && argsArr.length === 1) {
    const flagInput = argsArr[0];
    if (flags.includes(flagInput)) {
      if (flagInput === '--EOL') console.log(`EOL: ${JSON.stringify(EOL)}`);
      if (flagInput === '--homedir') console.log(`Home Directory: ${ homedir() }`);
      if (flagInput === '--architecture') console.log(`Architecture: ${ arch() }`)
      if (flagInput === '--username') {
        try {
          console.log(`Username: ${ userInfo().username }`);
        }
        catch {
          console.error('Operation failed');
        }
      }
      if (flagInput === '--cpus') {
        const CPUS = cpus();
        console.log(`Logical CPUs: ${CPUS.length}`);
        // const table = new Table({
        //   head: ['CPU', 'Model', 'Speed (GHz)'],
        //   colAligns: ['center', 'left', 'right'],
        //   colWidths: [6, 16, 14],
        //   style: {
        //     head: ['green', 'bold'],
        //     compact: true,
        //   }
        // })
        //
        // CPUS.forEach((cpu, i) => table.push([
        //   (i + 1),
        //   cpu.model.trim(),
        //   (cpu.speed / 1000).toFixed(2)
        // ]))
        const formattedCPUs = {};
        CPUS.forEach((cpu, i) => {
          formattedCPUs[`CPU ${i + 1}`] = {
            model: cpu.model.trim(),
            'speed (GHz)': `${(cpu.speed/1000).toFixed(2)} GHz`,
          }
        })
        console.table(formattedCPUs);
        // console.log(table.toString());
      }
    } else {
      console.error('Invalid input')
    }
  } else {
    console.error('Invalid input')
  }
}
