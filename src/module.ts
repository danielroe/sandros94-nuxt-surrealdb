import { defineNuxtModule, addPlugin, addImportsDir, createResolver } from '@nuxt/kit'
import { defu } from 'defu'

export interface DatabasePreset {
  url?: string
  NS?: string
  DB?: string
}

// Module options TypeScript interface definition
export interface ModuleOptions {
  databases: {
    default: DatabasePreset
    [key: string]: DatabasePreset | undefined
  }
  tokenCookieName: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-surrealdb',
    configKey: 'surrealdb',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    databases: {
      default: {
        url: '',
        NS: '',
        DB: '',
      },
    },
    tokenCookieName: 'surrealdb_token',
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.surrealdb = defu(
      nuxt.options.runtimeConfig.public.surrealdb,
      options,
    )

    addPlugin(resolve('./runtime', 'plugin'))
    addImportsDir(resolve('./runtime', 'composables'))
  },
})
