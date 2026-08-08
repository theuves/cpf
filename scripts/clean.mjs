import { rmSync } from 'node:fs'
import { resolve } from 'node:path'

rmSync(resolve('dist'), { recursive: true, force: true })
