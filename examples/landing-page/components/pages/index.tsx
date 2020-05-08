import 'uikit/dist/css/uikit.css'

import loadable from '@loadable/component'
import React, { Fragment } from 'react'

import AboveTheFold from '../aboveTheFold'

const BellowTheFold = loadable(() => import(
  /* webpackChunkName: "BellowTheFold" */
  /* webpackPreload: true */
  '../bellowTheFold'
), { ssr: false })

interface Props {
  data: any
}

const Page: React.SFC<Props> = ({ data }) => {
  // console.log(Object.keys(data).length > 10 ? 'Have Data' : 'DATA MISSING !!!', data)
  return (
    <Fragment>
      <AboveTheFold />
      <BellowTheFold fallback={<div>loading...</div>}/>
    </Fragment>
  )
}

export default Page
