export const tree = {
  build: {
    description: 'Access for onBuild Micro lifecycle',
    dev: {
      description: 'Watch files for changes and start DevServer if project contains pages'
    },
    prod: {
      description: 'Build production ready ES modules'
    }
  },
  assemble: {
    description: 'Access for onAssemble Micro lifecycle',
    report: {
      description: 'Assemble and generate report'
    }
  },
  serve: {
    description: 'Serve an assembled Micro project'
  },
  setup: {
    description: 'Setup the current package.json as a Micro project',
    options: [
      {
        description: 'Do not change files, just show what would be output by this command',
        long: 'dry',
        short: 'd',
        type: 'boolean'
      }
    ]
  },
  options: [
    {
      description: 'Show help information',
      long: 'help',
      short: 'h',
      type: 'boolean'
    }
  ]
}