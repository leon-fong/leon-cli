import { program } from 'commander'
import { version } from '../package.json'

program.version(version)
program.parse(process.argv)
