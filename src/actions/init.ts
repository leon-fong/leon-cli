import path from 'node:path'
import fs from 'node:fs'
import kleur from 'kleur'
import { $ } from 'execa'

const welcome = 'Let\'s build something great! •ᴗ•'

function log(message: string) {
  return process.stdout.write(`${message}\n`)
}

function label(text: string, c = kleur.bgBlue, t = kleur.white) {
  return c(` ${t(text)} `)
}

export async function init(str: string, opts: { pnpm?: boolean }) {
  const packageManage = opts.pnpm ? 'pnpm' : 'yarn'
  const cwd = process.cwd()
  const root = path.join(cwd, str)
  fs.mkdirSync(root, { recursive: true })
  process.chdir(root)

  await $`git init`
  await $`${packageManage} init ${opts.pnpm ? '' : '-y'}`
  await $`${packageManage} add -D typescript @types/node`
  await $`${packageManage} tsc --init`

  await $`mkdir src/`
  await $`touch src/index.ts`
  await $`echo "node_modules" > .gitignore`

  log(label(welcome))
}
