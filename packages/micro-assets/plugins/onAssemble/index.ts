import { OnAssemblePlugin } from '@vtex/micro'
import { Block, Context, file, group, match } from 'webpack-blocks'

export default class OnAssemble extends OnAssemblePlugin {
  public getConfig = async (config: Block<Context>): Promise<Block<Context>> => {
    const block: Block<Context>[] = [
      match(['*.png', '*.svg', '*.jpg', '*.gif', '*.ico'], [
        file({
          name: '[name].[ext]'
        })
      ])
    ]

    return group([
      config,
      ...block
    ])
  }
}
