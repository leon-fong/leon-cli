import fs from 'node:fs'
import path from 'node:path'
import kleur from 'kleur'
import { cursor, erase } from 'sisteransi'
import { $ } from 'execa'
import { block } from '../utils'

const welcome = 'Let\'s build something great! •ᴗ•'
const frames = ['◒', '◐', '◓', '◑']

function log(message: string) {
  return process.stdout.write(`${message}\n`)
}

function label(text: string, c = kleur.bgBlue, t = kleur.white) {
  return c(` ${t(text)} `)
}

function spinner() {
  let unblock: () => void
  let loop: NodeJS.Timer
  const delay = 80
  return {
    start(message = '') {
      process.stdout.write(`${kleur.magenta('○')}  ${message}\n`)
      unblock = block()
      let i = 0
      let dot = 0
      loop = setInterval(() => {
        const frame = frames[i]
        process.stdout.write(cursor.move(-999, -1))
        process.stdout.write(`${kleur.magenta(frame)}  ${message}${Math.floor(dot) >= 1 ? '.'.repeat(Math.floor(dot)).slice(0, 3) : ''}   \n`)
        i = i === frames.length - 1 ? 0 : i + 1
        dot = dot === frames.length ? 0 : dot + 0.125
      }, delay)
    },
    stop(message = '') {
      process.stdout.write(cursor.move(-999, -1))
      process.stdout.write(erase.down(2))
      clearInterval(loop)
      process.stdout.write(`${kleur.green('◇')}  ${message}\n`)
      unblock()
    },
  }
}

export async function init(str: string, opts: { pnpm?: boolean }) {
  const packageManager = opts.pnpm ? 'pnpm' : 'yarn'
  const s = spinner()
  s.start(`Installing via ${packageManager}`)

  const cwd = process.cwd()
  const root = path.join(cwd, str)
  fs.mkdirSync(root, { recursive: true })
  process.chdir(root)

  await $`git init`
  await $`${packageManager} init ${opts.pnpm ? '' : '-y'}`
  await $`${packageManager} add -D typescript @types/node`
  await $`${packageManager} tsc --init`
  await $`mkdir src/`
  await $`touch src/index.ts`
  await $`echo "node_modules" > .gitignore`

  s.stop(`Installed via ${packageManager}\n`)

  const tips = `cd ${str}`
  log(`${kleur.gray(tips)}`)
  log(`\n${label(welcome)}`)
}
