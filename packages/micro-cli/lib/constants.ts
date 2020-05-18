export const SERVER_PORT = Number.parseInt(process.env.PORT || '3000')

export const HOST = `http://localhost:${SERVER_PORT}`

export const BUILD = 'build.json'

export const PUBLIC_PATHS = {
  assets: '/assets/',
  data: '/api/'
}