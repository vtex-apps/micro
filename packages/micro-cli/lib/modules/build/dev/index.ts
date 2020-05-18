import { transformFileAsync } from '@babel/core'
import { OnBuildCompiler } from '@vtex/micro'
import { startDevServer } from '@vtex/micro-server'
import chalk from 'chalk'
import { outputFile } from 'fs-extra'

import { cleanDist, newProject, resolveProject } from '../../../common/project'
import { HOST, PUBLIC_PATHS } from '../../../constants'
import { SERVER_PORT } from './../../../constants'

process.env.NODE_ENV = 'development'

const target = 'onBuild'

const main = async () => {
  console.log('🦄 Starting Dev Build')

  const project = newProject()
  const plugins = await resolveProject(project, target)

  console.log(`🦄 [${target}]: Retrieving files`)
  const files = project.root.getFiles('components|pages')

  console.log(`🦄 [${target}]: Creating Compiler`)
  const compiler = new OnBuildCompiler({ project, plugins } as any) // TODO: fix this as any
  const config = compiler.getConfig()

  const dist = compiler.getDist('es6')
  await cleanDist(dist)

  console.log(`🦄 [${target}]: Running Build`)
  let error = null
  for (const file of files) {
    try {
      const transformed = await transformFileAsync(file, config)
      const targetFile = file.replace(project.root.path, dist).replace(/.tsx?$/, '.js')
      console.log('writting', targetFile)
      await outputFile(targetFile, transformed?.code)
    } catch (err) {
      error = err
      break
    }
  }

  if (error) {
    console.log(chalk.red('💣 Something went wrong'), error)
  }

  console.log(`🦄 [${target}]: Starting DevServer`)
  await startDevServer({
    publicPaths: PUBLIC_PATHS,
    project,
    host: HOST,
    port: SERVER_PORT
  })
}

export default main
