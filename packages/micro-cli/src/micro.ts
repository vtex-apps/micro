#!/usr/bin/env node
import { loadBuild, newBuild } from './build'
import { SERVER_PORT } from './constants'
import { parseOptions } from './parse'
import { loadProject } from './project'
import { startServer } from './server'
import { name, version } from '../package.json'

const main = async () => {
  console.log(`🦄 Welcome to ${name}@${version}`)

  const { projectPath, production, serve, build } = await parseOptions()

  const project = await loadProject({ projectPath })
  
  if (serve) {
    console.log(`🦄 Loading build for ${project.manifest.name}@${project.manifest.version}`)
    const statsJSON = await loadBuild({ project, production })
    startServer(project, statsJSON, SERVER_PORT)
  } else if (build) {
    console.log(`🦄 Starting build in production:${production} for ${project.manifest.name}@${project.manifest.version}`)
    const build = await newBuild({ project, production })
    const configs = await build.config()
    await build.run(configs)
  } else if (!production) {
    const build = await newBuild({ project, production })
    const configs = await build.config()
    const statsJSON = await build.run(configs)
    startServer(project, statsJSON, SERVER_PORT)
  } else {
    console.log('🙉Could not understand what you mean')
  }
}

main().catch(console.error)
