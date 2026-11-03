import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import process from 'node:process'
import { parse } from 'yaml'
import { applyReviews } from '@diglot/x18n'

interface Author {
  name?: string
  email?: string
}

interface ReviewComment {
  author?: Author
}

type Threads = Record<string, Record<string, ReviewComment[]>>

function reviewerIdentity(): string {
  try {
    const login = execFileSync('gh', ['api', 'user', '--jq', '.login'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
    if (login)
      return login
  }
  catch {}
  try {
    const name = execFileSync('git', ['config', 'user.name'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
    if (name)
      return name
  }
  catch {}
  return ''
}

const root = process.argv[2] ?? '.'
const by = reviewerIdentity()
if (!by) {
  console.error('Could not resolve a reviewer identity: authenticate gh or set git user.name.')
  process.exit(1)
}

let raw: { threads?: Threads } | null

try {
  raw = parse(readFileSync(`${root}/.x18n/reviews.yml`, 'utf8')) as { threads?: Threads } | null
}
catch (error) {
  console.error(`Could not read ${root}/.x18n/reviews.yml: ${(error as Error).message}. Run "pnpm x18n review approve <hash> --locale fr" first.`)
  process.exit(1)
}

const threads = raw?.threads ?? {}

for (const byLocale of Object.values(threads)) {
  for (const comments of Object.values(byLocale)) {
    for (const comment of comments)
      comment.author = { ...comment.author, name: by }
  }
}

const written = await applyReviews(root, { threads })
console.log(`Reviewer: ${by}`)
if (!written.length) {
  console.log('No records to verify.')
}
else {
  console.log(`Verified ${written.length} record${written.length === 1 ? '' : 's'}:`)
  for (const path of written)
    console.log(`  ${path}`)
}
