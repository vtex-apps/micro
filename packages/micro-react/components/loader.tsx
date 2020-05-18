import { loadableReady } from '@loadable/component'
import { getPageData, canUseDOM } from '@vtex/micro'
import React from 'react'
import { hydrate, render } from 'react-dom'

import { getAppContainer } from './container'
import { getRuntimeData } from './runtime'
import { Runtime } from './context/Runtime'

// import { hot } from 'react-hot-loader/root'

;(window as any).__MICRO_REACT_HYDRATED__ = false

const renderOrHydrate = (App: React.ReactType) => async () => {

  if ((window as any).__MICRO_REACT_HYDRATED__ === false) {
    (window as any).__MICRO_REACT_HYDRATED__ = true

    const container = getAppContainer()
    const runtimeData = getRuntimeData()
  
    // This should be preloaded by now
    let error = null
    const data = await getPageData().catch(err => { error = err })
  
    const AppWithContext = (
      <Runtime.Provider value={runtimeData}>
        <App data={data} error={error} />
      </Runtime.Provider>
    )
  
    if (container.children.length > 0) {
      const msg = '[micro-react]: ⚡⚡ Hydration took'
      console.time(msg)
      hydrate(AppWithContext, container)
      console.timeEnd(msg)
    } else {
      const msg = '[micro-react]: ⚡ Rendering took'
      console.time(msg)
      render(AppWithContext, container)
      console.timeEnd(msg)
    }
  }
}

export const LoadMicroComponent = (App: React.ReactType) => {
  if (canUseDOM) {
    // renderOrHydrate(App)
    loadableReady(() => {
      window.onload = renderOrHydrate(App)
    })
    setTimeout(renderOrHydrate(App), 1e3)
  }
  return App
}
