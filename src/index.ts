import { Command } from 'commander'
import { version } from '../package.json'
const program = new Command()
program.version(version)
program.parse(process.argv)
