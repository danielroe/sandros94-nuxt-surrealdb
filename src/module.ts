import type { PublicRuntimeConfig, RuntimeConfig } from 'nuxt/schema'
import { defineNuxtModule, addPlugin, addImportsDir, addServerImportsDir, createResolver } from '@nuxt/kit'
import { defu } from 'defu'

import type { DatabasePreset } from './runtime/types'

// Module options TypeScript interface definition
export interface ModuleOptions {
  auth?: {
    database?: keyof PublicRuntimeConfig['surrealdb']['databases'] | false
    sessionName?: string
    cookieName?: string
    sameSite?: boolean | 'strict' | 'lax' | 'none'
    maxAge?: number
  }
  databases?: {
    default?: DatabasePreset
    [key: string]: DatabasePreset | undefined
  }
  server?: {
    defaultDatabase?: keyof PublicRuntimeConfig['surrealdb']['databases'] | keyof RuntimeConfig['surrealdb']['databases']
    databases?: {
      [key: string]: DatabasePreset | undefined
    }
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-surrealdb',
    configKey: 'surrealdb',
  },
  defaults: {
    auth: {
      database: 'default',
      sessionName: 'nuxt-session',
      cookieName: 'nuxt-surrealdb',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    },
    databases: {
      default: {
        host: '',
        NS: '',
        DB: '',
        SC: '',
        auth: '',
      },
    },
    server: {
      defaultDatabase: 'default',
    },
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Public RuntimeConfig
    nuxt.options.runtimeConfig.public.surrealdb = defu<
      PublicRuntimeConfig['surrealdb'],
      Omit<ModuleOptions, 'server'>[]
    >(
      nuxt.options.runtimeConfig.public.surrealdb,
      {
        auth: options.auth,
        databases: options.databases,
      },
    )
    // Private RuntimeConfig
    nuxt.options.runtimeConfig.surrealdb = defu<
      RuntimeConfig['surrealdb'],
      ModuleOptions['server'][]
    >(
      nuxt.options.runtimeConfig.surrealdb,
      {
        defaultDatabase: options.server?.defaultDatabase,
        databases: options.server?.databases,
      },
    )

    nuxt.options.alias['#surreal-auth'] = resolve('./runtime', 'types', 'auth')

    addPlugin(resolve('./runtime', 'plugin'))
    addImportsDir(resolve('./runtime', 'composables'))
    addServerImportsDir(resolve('./runtime', 'server', 'utils'))
  },
})
