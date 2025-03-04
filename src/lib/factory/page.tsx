/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { generatePath, Route, RouteComponentProps, Switch } from 'react-router-dom'
import * as navigationHelper from '../../helper/navigation'
import React, { ComponentType, LazyExoticComponent, PropsWithChildren } from 'react'

export type WrapperProps = PropsWithChildren<{ path: string }>
interface PageProps extends RouteComponentProps {}

type ParamsPageType = Record<string, string | number | boolean | undefined>

interface NavigationEventOptions {
  method?: 'push' | 'replace' | 'newPage'
  state?: unknown
  queryString?: string
}

export interface AppPageConfig<ChildrenPage> {
  name: string
  page?: () => LazyExoticComponent<ComponentType<PageProps>> | React.ComponentType<PageProps>
  exact?: boolean
  strict?: boolean
  path: string
  extendsParentPagePath?: boolean
  childrenPages?: ChildrenPage
  onRender?: React.ComponentType<WrapperProps>
}

export type PageParamsType<Page extends AppPage<any, any>> = Page extends AppPage<infer T> ? T : unknown
export class AppPage<
  Params extends ParamsPageType = {},
  ChildrenPage extends { [key: string]: AppPage<any, any> } = {}
> {
  public config: AppPageConfig<ChildrenPage>

  public childrenPages: ChildrenPage

  constructor(config: AppPageConfig<ChildrenPage>) {
    this.config = config
    this.childrenPages = Object.entries(config.childrenPages || ({} as ChildrenPage)).reduce(
      (childrenPages, [key, child]) => {
        const { extendsParentPagePath = true } = child.config

        childrenPages[key] = child.clone({
          path: extendsParentPagePath ? `${config.path}${child.config.path}` : child.config.path
        })
        return childrenPages
      },
      {} as any
    ) as ChildrenPage
  }

  goto(param?: Params, { method = 'push', state, queryString }: NavigationEventOptions = {}) {
    const { path } = this.config
    const pagePath = `${generatePath(path, param)}${queryString || ''}`

    if (!pagePath) return

    if (method === 'push') navigationHelper.push(pagePath, state)
    if (method === 'replace') navigationHelper.replace(pagePath, state)
    if (method === 'newPage') navigationHelper.newPage(pagePath)
  }

  gotoChild<Key extends keyof ChildrenPage>(
    childrenName: Key,
    options?: {
      params?: Parameters<ChildrenPage[Key]['goto']>[0]
      queryString?: string
    } & NavigationEventOptions
  ) {
    const children = this.childrenPages[childrenName]
    if (children) {
      children.goto(options?.params, {
        method: options?.method,
        queryString: options?.queryString,
        state: options?.state
      })
    }
  }

  clone(overwriteConfig: Partial<AppPageConfig<ChildrenPage>>) {
    return new AppPage({
      ...this.config,
      ...(overwriteConfig || {})
    })
  }

  get path() {
    return this.config.path
  }

  get children() {
    return this.childrenPages
  }

  generatePath(params?: Params, options?: { queryString: string }) {
    return `${generatePath(this.config.path, params)}${options?.queryString || ''}`
  }

  render() {
    const { onRender, exact, page, path, strict } = this.config
    let component: React.LazyExoticComponent<React.ComponentType<PageProps>> | React.ComponentType<PageProps>

    if (page) {
      component = page()
    }

    const routeComponent = (
      <Route
        key={path}
        path={path}
        exact={exact}
        strict={strict}
        component={(props: PageProps) =>
          React.createElement(
            component || React.Fragment,
            component ? { ...props, key: path } : null,
            <Switch>{renderPages(...Object.values(this.childrenPages))}</Switch>
          )
        }
      />
    )

    if (onRender) {
      return React.createElement(onRender, { path, key: path }, routeComponent)
    }

    return routeComponent
  }
}

export const createAppPage = <
  Params extends ParamsPageType,
  ChildrenPage extends { [key: string]: AppPage<any, any> } = {}
>(
  config: AppPageConfig<ChildrenPage>
): AppPage<Params, ChildrenPage> => {
  return new AppPage(config) as AppPage<Params, ChildrenPage>
}

export const renderPages = (...pages: AppPage[]) => pages.map((page) => page.render())
