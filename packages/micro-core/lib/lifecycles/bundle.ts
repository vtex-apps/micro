import { join } from 'path'
import { Configuration } from 'webpack'
import { Block, Context, createConfig, setOutput } from 'webpack-blocks'

import { Mode } from '../common/mode'
import { Compiler, CompilerOptions } from '../compiler'
import { Plugin } from '../plugin'
import { Project } from '../project'

const lifecycle = 'bundle'

export const pagesRuntimeName = 'micro-runtime'
export const webpackRuntimeName = 'webpack-runtime'
export const pagesFrameworkName = 'micro-framework'

export type BundleTarget = 'webnew' | 'webold'

export type BundleCompilerOptions = Omit<CompilerOptions<BundlePlugin>, 'target' | 'plugins'> & {
  plugins: Array<new (options: BundlePluginOptions) => BundlePlugin>
  mode: Mode
}

export class BundleCompiler extends Compiler<BundlePlugin> {
  constructor ({ project, plugins, mode }: BundleCompilerOptions) {
    super({ project, plugins: [], target: lifecycle })
    this.plugins = plugins.map(P => new P({ project, mode }))
  }

  public getConfig = async (target: BundleTarget): Promise<Configuration> => {
    const initialConfig = setOutput({
      path: join(this.dist, target),
      publicPath: '/assets'
    })
    const merged = await this.plugins.reduce(
      async (acc, plugin) => plugin.getConfig(await acc, target),
      Promise.resolve(initialConfig)
    )
    return createConfig(merged)
  }
}

export interface BundlePluginOptions {
  project: Project
  mode: Mode
}

export abstract class BundlePlugin extends Plugin {
  public project: Project
  public mode: Mode

  constructor (
    options: BundlePluginOptions
  ) {
    super({ target: lifecycle })
    this.project = options.project
    this.mode = options.mode
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public abstract getConfig = async (config: Block<Context>, target: BundleTarget): Promise<Block<Context>> => {
    throw new Error(`💣 not implemented: ${target}, ${config}`)
  }
}
