import { Command } from 'commander'
import { version } from '../package.json'
import { init } from './actions/init'

const program = new Command()

program
  .name('leon')
  .description('Fast and lightweight CLI')
  .version(version)

program
  .command('init')
  .description('init a something')
  .argument('<string>', 'project name')
  .option('-p, --pnpm', 'use pnpm for installation')
  .action(init)

program.parse(process.argv)
