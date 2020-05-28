import { isSemver } from '../../components/semver'
import { pick } from '../common/pick'

type MicroOptions = {
  plugins: {
    onAssemble?: string[]
    onRequest?: string[]
    onBuild?: string[]
  }
}

export const BaseManifest = {
  main: './.micro/onBuild/cjs/index.js',
  module: './.micro/onBuild/es6/components/index.js',
  browser: './components/index.ts',
  micro: {
    plugins: {}
  } as MicroOptions,
  scripts: {
    build: 'yarn run micro build',
    watch: 'yarn run micro link',
    clean: 'rm -r .micro',
    prepublish: 'yarn build'
  }
}

const necessary = pick(BaseManifest, ['main', 'module', 'browser'])
const required = pick(BaseManifest, ['micro'])

type Base = typeof BaseManifest

export interface Manifest extends Base {
  name: string
  version: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}

// TODO: improve this condition
const isMicro = (x: any): x is MicroOptions => x?.plugins && Object.keys(x.plugins).length <= 3

export const isManifest = (obj: any): obj is Manifest => {
  return typeof obj?.name === 'string' &&
    isSemver(obj.version) &&
    obj.main === BaseManifest.main &&
    obj.module === BaseManifest.module &&
    obj.browser === BaseManifest.browser &&
    isMicro(obj.micro)
}

export const genManifest = (partial: Pick<Manifest, 'name' | 'version'>): Manifest => {
  const {
    name,
    version,
    license,
    micro,
    main,
    types,
    module,
    browser,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type,
    scripts,
    dependencies,
    devDependencies,
    peerDependencies,
    ...rest
  } = {
    ...required,
    ...partial,
    ...necessary
  } as any

  return {
    name,
    version,
    license,
    micro,
    scripts: {
      ...BaseManifest.scripts,
      ...scripts
    },
    main,
    types,
    module,
    browser,
    dependencies,
    devDependencies,
    peerDependencies,
    ...rest
  }
}
