import { LifeCycle, MICRO_BUILD_DIR, Plugins, Project, walk } from '@vtex/micro-core'
import assert from 'assert'
import chalk from 'chalk'
import { ensureDir } from 'fs-extra'
import { join } from 'path'

export const newProject = async () => {
  const projectPath = process.cwd()

  const project = new Project({ rootPath: projectPath })

  console.log('🦄 Resolving dependencies')
  await project.resolvePackages()
  walk(project.root, curr => {
    console.info(`📦 Micro package found: ${curr.toString()}`)
  })

  return project
}

export const ensureDist = async (target: string, path: string) => {
  console.log(`🎯 [${target}]: Ensuring dist folder in ${chalk.cyanBright(join(MICRO_BUILD_DIR, path.split(MICRO_BUILD_DIR)[1]))}`)
  await ensureDir(path)
}

export const resolvePlugins = async <T extends LifeCycle>(project: Project, lifecycle: T): Promise<NonNullable<Plugins[T]>[]> => {
  const {
    root: { manifest: { micro: { plugins: pls } } }
  } = project
  const names = (pls || []) as string[]

  console.log(`🦄 [${lifecycle}]: Resolving plugins`)
  const plugins = await project.resolvePlugins(lifecycle)

  assert(
    plugins.length === names.length ||
    plugins.length === names.length - 1, // in case this is a self referenced project
    `💣 Something went wrong when resolving the project's plugins. Expecting ${names.length} plugins, but got ${plugins.length}`
  )

  for (const pkg of names) {
    console.log(`🔌 [${lifecycle}]: Plugin found ${pkg}`)
  }

  return plugins
}

export const loadProject = () => {

}
