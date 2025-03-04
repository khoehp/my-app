interface RouteEventProps<T> {
  state?: T
  path?: string
  type: 'push' | 'replace' | 'goBack' | 'newPage'
}

const createRouteChangeEvent = <T>(routeEventProps: RouteEventProps<T>) => {
  const { path, state, type } = routeEventProps
  return new CustomEvent('route', {
    detail: {
      type,
      path,
      state
    }
  })
}

export const push = <T>(to: string, state?: T) => {
  if (!window) return
  const event = createRouteChangeEvent({ path: to, state, type: 'push' })
  window.dispatchEvent(event)
}

export const replace = <T>(to: string, state?: T) => {
  if (!window) return
  const event = createRouteChangeEvent({ path: to, state, type: 'replace' })
  window.dispatchEvent(event)
}

export const newPage = (to: string) => {
  if (!window) return
  const event = createRouteChangeEvent({ path: to, type: 'newPage' })
  window.dispatchEvent(event)
}

export const goBack = () => {
  if (!window) return
  const event = createRouteChangeEvent({ type: 'goBack' })
  window.dispatchEvent(event)
}
